# Zot SDK

Official TypeScript SDK for [Zot](https://zot.so). Add users to your waitlist from any Node.js, Bun, Deno, or browser app.

## Two ways to use it

1. **Plain client** (`zot-sdk`): for servers, scripts, and backends.
2. **React hook** (`zot-sdk/react`): for React apps. Handles loading and success state for you.

Pick whichever fits your app. You do not need both.

## 1. Plain client

Use this on a server, API route, or backend job.

```ts
import { ZotSDK } from "zot-sdk";

const zot = new ZotSDK({ apiKey: process.env.ZOT_API_KEY! });

await zot.waitlist("wl_abc123").addUser({
  email: "alice@example.com",
  name: "Alice"
});
```

That is it. One line and the user is on the waitlist.

### Other things you can do

```ts
// Create a waitlist
const waitlist = await zot.waitlists.create({
  name: "Early Access",
  sendEmailToNewSignup: true
});

// Count users
const { total, referred } = await zot.waitlist(waitlist._id).userCount();

// Search a user
const user = await zot.waitlist(waitlist._id).searchUser("alice@example.com");

// Change a user's status
await zot.waitlist(waitlist._id).updateUserStatus({
  email: "alice@example.com",
  status: "invited"
});
```

Full method list is at the bottom of this file.

## 2. React hook

If you are building with React (including Next.js), import the hook instead. It gives you `isPending` and `isUserRegistered` out of the box, so you do not need TanStack Query, Zustand, or `useState`.

```tsx
"use client";

import { useState } from "react";
import { useAddUser } from "zot-sdk/react";

export function JoinWaitlist() {
  const [email, setEmail] = useState("");

  const { addUser, isPending, isUserRegistered, error } = useAddUser({
    apiKey: process.env.NEXT_PUBLIC_ZOT_API_KEY!,
    waitlistId: "wl_abc123"
  });

  if (isUserRegistered) return <p>Thanks! You are on the list.</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addUser({ email });
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={isPending}>
        Join
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

### What the hook returns

| Field              | What it is                                               |
| ------------------ | -------------------------------------------------------- |
| `addUser(params)`  | Call this to register a user. Same shape as the client.  |
| `isPending`        | `true` while the request is running.                     |
| `isUserRegistered` | `true` after a successful signup.                        |
| `data`             | The registered user object, or `undefined`.              |
| `error`            | The error object, or `undefined`.                        |
| `isError`          | Shortcut for `error !== undefined`.                      |
| `reset()`          | Clear the state back to its initial values.              |

### Optional callbacks

```tsx
useAddUser({
  apiKey: "...",
  waitlistId: "...",
  onSuccess: (user) => console.log("Joined!", user),
  onError: (err) => console.error(err)
});
```

### In Next.js

Use the `NEXT_PUBLIC_` prefix so the key is available in the browser:

```bash
# .env.local
NEXT_PUBLIC_ZOT_API_KEY=zot_live_xxx
```

## API key

All requests use the `x-api-key` header. Get yours from the [Zot dashboard](https://zot.so).

Keep your key safe:

* Use the plain client only on servers.
* With the React hook, use a key with limited permissions (signup only) and expose it via `NEXT_PUBLIC_`.

## Config

```ts
new ZotSDK({
  apiKey: "zot_live_xxx",   // required
  baseUrl: "https://api.zot.so" // optional, for self-hosted or staging
});
```

## Error handling

Failed requests throw a `ZotAPIError`:

```ts
import { ZotAPIError } from "zot-sdk";

try {
  await zot.waitlist("wl_xxx").addUser({ email: "a@b.com" });
} catch (err) {
  if (err instanceof ZotAPIError) {
    console.error(err.statusCode, err.body);
  }
}
```

Common codes:

| Code | Meaning                         |
| ---- | ------------------------------- |
| 400  | Validation error.               |
| 401  | Invalid or missing API key.     |
| 404  | Waitlist or user not found.     |
| 409  | Email already registered.       |
| 429  | Rate limit. Back off and retry. |
| 5xx  | Server issue. Retry later.      |

With the React hook, the same error lands in `error` and triggers `onError`.

## TypeScript

All public types are exported:

```ts
import type {
  AddUserParams,
  CreateWaitlistParams,
  UpdateUserStatusParams,
  WaitlistResponse,
  WaitlistUserResponse
} from "zot-sdk";
```

## Full method list

### `zot.waitlists`

| Method     | Description            |
| ---------- | ---------------------- |
| `create()` | Create a new waitlist. |
| `list()`   | List your waitlists.   |

### `zot.waitlist(id)`

| Method                | Description                   |
| --------------------- | ----------------------------- |
| `get()`               | Get this waitlist.            |
| `update(params)`      | Update settings.              |
| `delete()`            | Delete permanently.           |
| `stats()`             | Aggregated stats.             |
| `webhookEvents()`     | Webhook delivery history.     |
| `addUser(params)`     | Register a new user.          |
| `listUsers()`         | List users.                   |
| `userCount()`         | Total and referred counts.    |
| `searchUser(email)`   | Find a user by email.         |
| `updateUserStatus(p)` | Change a user's status.       |
| `bulkDeleteUsers(e)`  | Delete one or many users.     |
| `blockedUsers()`      | List blocked users.           |
| `blockedUserCount()`  | Count blocked users.          |

## License

MIT
