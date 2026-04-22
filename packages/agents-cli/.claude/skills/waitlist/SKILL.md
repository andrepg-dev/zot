---
name: waitlist
version: 0.3.0
description: Integrate a Zot waitlist into any TypeScript, React, or Next.js app using the official `zot-sdk` and the `zot-cli` command-line tool. Use this skill whenever the user asks to "add a waitlist", "create a waitlist", "collect signups", "add early access", "integrate Zot", "build a coming soon page with email capture", or wires email capture to Zot.
triggers:
  - add a waitlist
  - create a waitlist
  - integrate Zot
  - collect waitlist signups
  - early access form
  - coming soon page
  - signup form with Zot
  - zot-sdk
  - zot-cli
  - zot-agents
  - useAddUser
---

# Zot Waitlist — Best Practices

This skill tells you how to integrate a Zot waitlist correctly. Follow these rules. Do not invent alternatives.

## TL;DR — the shortest path

```bash
# 1. Install the SDK
npm install zot-sdk

# 2. Create the waitlist and persist its ID in .env.local
npx zot-cli waitlist create --name "Early Access" --write-env .env.local --public

# 3. Build the UI (see Pattern B below) using `useAddUser` from "zot-sdk/react"
```

That is the entire integration for a Next.js project. Do not add TanStack Query, do not write a custom POST handler, do not call the API with raw `fetch`. Everything you need is below.

## Non-negotiable rules

1. **Use the official SDK.** Package name: `zot-sdk`. Never call `https://api.zot.so` with raw `fetch`, `axios`, or similar.
2. **Pick the right entry point based on where the code runs:**
   - Server, API route, cron, script, edge function → `import { ZotSDK } from "zot-sdk"`
   - React component that runs in the browser → `import { useAddUser } from "zot-sdk/react"`
3. **Never wrap `useAddUser`** in TanStack Query, SWR, `useState`, Zustand, or a custom reducer. The hook already exposes `isPending`, `isUserRegistered`, `data`, `error`, `isError`, and `reset`. Reusing its state is the whole point.
4. **Never ship a server-side API key to the client.** For browser code use a key with signup-only permissions and expose it as `NEXT_PUBLIC_ZOT_API_KEY` (or your framework's public-env equivalent).
5. **Always handle `ZotAPIError`.** Show user-friendly copy for 409 (already registered) and 429 (rate limit).

## Install

```bash
npm install zot-sdk
# or
pnpm add zot-sdk
# or
yarn add zot-sdk
```

No extra peer deps are required for server usage. For the hook, `react >= 18` must already be installed (the SDK marks it as optional peer).

## Get your credentials

You need two things:

1. **API key** — from the Zot dashboard at https://zot.so. Create one key for server usage and, if you plan to call from the browser, a second key scoped to signup-only.
2. **Waitlist ID** — looks like `wl_abc123`.

### Create the waitlist with `zot-cli` (recommended)

If the user does not already have a waitlist, use the official Zot CLI. It calls the Zot API with the user's `ZOT_API_KEY` and writes the resulting ID directly into the env file so you never have to copy-paste it.

> Package: `zot-cli`. Do **not** confuse it with `zot-agents` — `zot-agents` only installs this agent guide into a repo; `zot-cli` talks to the Zot API.

```bash
# Make sure ZOT_API_KEY is set (in the shell, in .env.local, or in .env)
npx zot-cli waitlist create \
  --name "Early Access" \
  --write-env .env.local \
  --public
```

What this does:

- Calls `POST /v1/wait-list` via `zot-sdk` under the hood.
- Prints the new waitlist (`_id`, `name`, flags, timestamps).
- Appends `ZOT_WAITLIST_ID=wl_...` to `.env.local`.
- Because `--public` was passed, it also appends `NEXT_PUBLIC_ZOT_WAITLIST_ID=wl_...` for client-side usage in Next.js.

Useful variations:

```bash
# Pure server stack (Node/Nest/Express). Drop --public.
npx zot-cli waitlist create --name "Beta list" --write-env .env

# Non-interactive / scripted use. Prints JSON only.
npx zot-cli waitlist create --name "Beta list" --api-key $ZOT_API_KEY --json

# Disable the automatic welcome email.
npx zot-cli waitlist create --name "Quiet list" --no-send-email
```

If the CLI exits with `No API key found`, the user has to get one at https://zot.so and either export `ZOT_API_KEY` in their shell or add it to `.env.local` / `.env` before retrying.

### Alternative: create it from code (only if you have a clear reason)

```ts
import { ZotSDK } from "zot-sdk";

const zot = new ZotSDK({ apiKey: process.env.ZOT_API_KEY! });

const waitlist = await zot.waitlists.create({
  name: "Early Access",
  sendEmailToNewSignup: true,
});

console.log(waitlist._id); // ← save this as ZOT_WAITLIST_ID
```

Only do this if the user explicitly wants creation flow inside their own app (e.g. admin UI that creates new waitlists per tenant). For a one-off project setup, always prefer the CLI.

## Environment variables

Pick the pattern that matches the runtime.

### Pure server / Node / backend

```bash
# .env
ZOT_API_KEY=zot_xxx
ZOT_WAITLIST_ID=wl_abc123
```

### Next.js with the React hook on the client

```bash
# .env.local
NEXT_PUBLIC_ZOT_API_KEY=zot_xxx_signup_only
NEXT_PUBLIC_ZOT_WAITLIST_ID=wl_abc123
```

Use the `NEXT_PUBLIC_` key only for the signup-scoped key. Keep the full-access key server-side under `ZOT_API_KEY`.

## Pattern A — Server / API route

Use when the form submits to your backend (Next.js Server Action, API route, Express handler, Nest controller, etc.).

```ts
// app/api/waitlist/route.ts (Next.js App Router)
import { NextResponse } from "next/server";
import { ZotSDK, ZotAPIError } from "zot-sdk";

const zot = new ZotSDK({ apiKey: process.env.ZOT_API_KEY! });

export async function POST(request: Request) {
  const { email, name } = await request.json();

  try {
    const user = await zot.waitlist(process.env.ZOT_WAITLIST_ID!).addUser({
      email,
      name,
    });
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    if (err instanceof ZotAPIError) {
      if (err.statusCode === 409) {
        return NextResponse.json(
          { ok: false, reason: "already_registered" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { ok: false, reason: "zot_error", details: err.body },
        { status: err.statusCode },
      );
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
```

## Pattern B — Next.js client component with `useAddUser` (recommended for landing pages)

This is the canonical way when the form lives in a React component. The hook persists the "already registered" state in `localStorage` keyed by `waitlistId`, so repeat visitors see the confirmation without a server round-trip.

```tsx
"use client";

import { useState } from "react";
import { useAddUser } from "zot-sdk/react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { addUser, isPending, isUserRegistered, error, reset } = useAddUser({
    apiKey: process.env.NEXT_PUBLIC_ZOT_API_KEY!,
    waitlistId: process.env.NEXT_PUBLIC_ZOT_WAITLIST_ID!,
    onSuccess: () => {
      // Optional: analytics, toast, redirect, etc.
    },
  });

  if (isUserRegistered) {
    return (
      <div>
        <p>You are on the list. We will email you soon.</p>
        <button type="button" onClick={reset}>
          Register another email
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addUser({ email, name: name || undefined });
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
        disabled={isPending}
      />
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name (optional)"
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Joining..." : "Join the waitlist"}
      </button>
      {error && (
        <p role="alert">
          {"statusCode" in error && (error as { statusCode: number }).statusCode === 409
            ? "This email is already on the list."
            : error.message}
        </p>
      )}
    </form>
  );
}
```

## Full API surface (only what you need)

### Server-side client

```ts
import { ZotSDK } from "zot-sdk";
const zot = new ZotSDK({ apiKey: "zot_xxx" });
```

| Call | Purpose |
| --- | --- |
| `zot.waitlists.create(params)` | Create a waitlist. |
| `zot.waitlists.list()` | List waitlists for the API key. |
| `zot.waitlist(id).get()` | Fetch one waitlist. |
| `zot.waitlist(id).update(params)` | Update settings. |
| `zot.waitlist(id).delete()` | Delete permanently. |
| `zot.waitlist(id).stats()` | Aggregated stats. |
| `zot.waitlist(id).addUser({ email, name?, referredBy?, source?, metadata? })` | Register a user. |
| `zot.waitlist(id).listUsers()` | List users. |
| `zot.waitlist(id).userCount()` | `{ total, referred }`. |
| `zot.waitlist(id).searchUser(email)` | Find a user. |
| `zot.waitlist(id).updateUserStatus({ email, status })` | Status is `"waiting" \| "invited" \| "converted" \| "churned"`. |
| `zot.waitlist(id).bulkDeleteUsers(emails)` | Accepts a single email or an array. |
| `zot.waitlist(id).blockedUsers()` / `blockedUserCount()` | Blocked users. |
| `zot.waitlist(id).webhookEvents()` | Webhook delivery history. |

### React hook

```tsx
import { useAddUser } from "zot-sdk/react";

const { addUser, data, error, isPending, isUserRegistered, isError, reset } = useAddUser({
  apiKey: "...",
  waitlistId: "wl_...",
  onSuccess: (user) => {},
  onError: (err) => {},
});
```

Everything the hook returns is listed above. Do not create parallel state for these values.

## Error codes

| Code | Meaning | UX guidance |
| --- | --- | --- |
| 400 | Validation error | Show field-level error. |
| 401 | Bad/missing API key | Never shown to end users, log it. |
| 404 | Waitlist not found | Config issue, log it. |
| 409 | Email already registered | Treat as success in most landing pages. |
| 429 | Rate limited | Ask the user to try again in a minute. |
| 5xx | Server issue | Retry once, then ask the user to try later. |

Detect with `err instanceof ZotAPIError` and read `err.statusCode` and `err.body`.

## Anti-patterns — do NOT do these

- ❌ Raw `fetch("https://api.zot.so/v1/wait-list/...")`. Use the SDK.
- ❌ Wrapping `useAddUser` in `useMutation` from TanStack Query. Redundant.
- ❌ Adding a manual `useState<boolean>` for loading. Use `isPending`.
- ❌ Storing "already registered" in your own localStorage key. `useAddUser` already does it under `zot:waitlist:registered:<waitlistId>`.
- ❌ Using the full-access `ZOT_API_KEY` inside a `"use client"` component.
- ❌ Calling `zot.waitlists.create` on every render, build, or app startup. Use `npx zot-cli waitlist create` once at setup time and store the ID.
- ❌ Hard-coding the waitlist ID inside the component. Read it from env (`ZOT_WAITLIST_ID` or `NEXT_PUBLIC_ZOT_WAITLIST_ID`).
- ❌ Silently swallowing errors. 409 is a product decision; others should be surfaced or logged.

## Verification checklist

Before telling the user the integration is done, confirm ALL of the following:

- [ ] `zot-sdk` is in `package.json` at the latest published version.
- [ ] A waitlist exists and its ID is stored in env (created via `npx zot-cli waitlist create` or, only if justified, via a one-time script).
- [ ] API key is in env vars, not hard-coded.
- [ ] If the key is used in client code, it is prefixed with `NEXT_PUBLIC_` (or equivalent) AND is a signup-scoped key.
- [ ] The waitlist ID is read from env, not hard-coded, unless the user explicitly asked for a hard-coded constant.
- [ ] The submit handler catches errors and the UI renders something for the error case.
- [ ] Success state is handled (either the hook's `isUserRegistered` or your own redirect/toast after `onSuccess`).
- [ ] No raw `fetch` to `api.zot.so` anywhere.
- [ ] No duplicated loading/error/success state around `useAddUser`.

If any box is unchecked, fix it before handing the task back to the user.
