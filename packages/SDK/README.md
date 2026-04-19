# Zot SDK

The official TypeScript/JavaScript SDK for [Zot](https://zot.so), a platform for managing waitlists, emails, and subscriptions.

Use it to grow your waitlist, track signups, manage user status, and wire up webhooks from any Node.js, Bun, Deno, or browser-like environment with `fetch` available.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Waitlists](#waitlists)
  - [Waitlist Users](#waitlist-users)
  - [Stats & Webhook Events](#stats--webhook-events)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [API Reference](#api-reference)
- [License](#license)

---

## Installation

```bash
npm install zot-sdk
```

```bash
yarn add zot-sdk
```

```bash
pnpm add zot-sdk
```

The SDK ships as an ES module with TypeScript definitions included. Node.js 18+ is required (for native `fetch` support).

---

## Quick Start

```ts
import { ZotSDK } from "zot-sdk";

const zot = new ZotSDK({ apiKey: process.env.ZOT_API_KEY! });

// Create a new waitlist
const waitlist = await zot.waitlists.create({
  name: "Early Access",
  sendEmailToNewSignup: true,
});

// Add a user to it
await zot.waitlist(waitlist._id).addUser({
  email: "alice@example.com",
  name: "Alice",
  source: "social",
});

// Check how many people are on the list
const { total, referred } = await zot.waitlist(waitlist._id).userCount();
console.log(`${total} signups (${referred} via referral)`);
```

That's it. Three lines, and you're capturing signups.

---

## Authentication

All requests are authenticated with an API key sent in the `x-api-key` header. You can generate one from your [Zot dashboard](https://zot.so).

```ts
const zot = new ZotSDK({
  apiKey: "zot_live_••••••••••••••••",
});
```

> **Never expose your API key in client-side code.** Use the SDK from a server, serverless function, or backend service.

---

## Configuration

The `ZotSDK` constructor accepts a single config object:

| Option    | Type     | Required | Default              | Description                                   |
| --------- | -------- | -------- | -------------------- | --------------------------------------------- |
| `apiKey`  | `string` | Yes      | none                 | Your Zot API key.                             |
| `baseUrl` | `string` | No       | `https://api.zot.so` | Override for self-hosted or staging backends. |

```ts
const zot = new ZotSDK({
  apiKey: process.env.ZOT_API_KEY!,
  baseUrl: "https://staging.api.zot.so", // optional
});
```

---

## Usage

The SDK is organized around two entry points:

- **`zot.waitlists`**: operations that span all your waitlists (create, list).
- **`zot.waitlist(id)`**: operations scoped to a single waitlist (get, update, delete, users, stats).

This split mirrors the REST API and keeps the scoping clear: anything that requires a waitlist ID lives on `zot.waitlist(id)`.

---

### Waitlists

#### Create a waitlist

```ts
const waitlist = await zot.waitlists.create({
  name: "Product Launch",
  sendEmailToNewSignup: true,
  webhook: {
    url: "https://my-app.com/webhooks/zot",
    range: 100, // fire webhook every 100 signups
  },
  isAvailable: true,
  isSecurityActive: false,
});
```

#### List all waitlists

```ts
const waitlists = await zot.waitlists.list();
```

#### Get a specific waitlist

```ts
const waitlist = await zot.waitlist("wl_abc123").get();
```

#### Update a waitlist

```ts
await zot.waitlist("wl_abc123").update({
  name: "Product Launch (Closed Beta)",
  isAvailable: false,
});
```

#### Delete a waitlist

```ts
await zot.waitlist("wl_abc123").delete();
```

> Deletion is permanent and will remove all associated users.

---

### Waitlist Users

#### Add a user

```ts
const user = await zot.waitlist("wl_abc123").addUser({
  email: "bob@example.com",
  name: "Bob",
  referredBy: "REF_ALICE42",   // optional referral code
  source: "paid_ads",          // "social" | "email" | "paid_ads"
  metadata: {                  // any JSON-serializable metadata
    plan: "pro",
    campaign: "spring-2026",
  },
});

console.log(user.referral_code); // share this with the user
```

#### List all users

```ts
const users = await zot.waitlist("wl_abc123").listUsers();
```

#### Search a user by email

```ts
const user = await zot.waitlist("wl_abc123").searchUser("bob@example.com");
```

#### Update a user's status

```ts
await zot.waitlist("wl_abc123").updateUserStatus({
  email: "bob@example.com",
  status: "invited", // "waiting" | "invited" | "converted" | "churned"
});
```

#### Bulk delete users

```ts
// single email
await zot.waitlist("wl_abc123").bulkDeleteUsers("bob@example.com");

// or a batch
await zot.waitlist("wl_abc123").bulkDeleteUsers([
  "bob@example.com",
  "carol@example.com",
]);
```

#### Blocked users

```ts
const blocked = await zot.waitlist("wl_abc123").blockedUsers();
const { total } = await zot.waitlist("wl_abc123").blockedUserCount();
```

---

### Stats & Webhook Events

#### Get aggregated stats

```ts
const stats = await zot.waitlist("wl_abc123").stats();
```

#### Get user counts

```ts
const { total, referred } = await zot.waitlist("wl_abc123").userCount();
```

#### Inspect webhook deliveries

```ts
const events = await zot.waitlist("wl_abc123").webhookEvents();
```

Useful for debugging. See which webhook calls fired, their status codes, and payloads.

---

## Error Handling

Every failed API call throws a `ZotAPIError` with the HTTP status code and the response body:

```ts
import { ZotSDK, ZotAPIError } from "zot-sdk";

const zot = new ZotSDK({ apiKey: process.env.ZOT_API_KEY! });

try {
  await zot.waitlist("wl_does_not_exist").get();
} catch (err) {
  if (err instanceof ZotAPIError) {
    console.error("Status:", err.statusCode);
    console.error("Body:", err.body);
  } else {
    throw err; // network error, etc.
  }
}
```

Common status codes:

| Code | Meaning                                            |
| ---- | -------------------------------------------------- |
| 400  | Validation error. Check the request body.         |
| 401  | Invalid or missing API key.                        |
| 403  | API key doesn't have access to this resource.     |
| 404  | Waitlist or user not found.                        |
| 409  | Conflict (e.g. email already registered).          |
| 429  | Rate limit exceeded. Back off and retry.          |
| 5xx  | Server-side issue. Retry with exponential backoff. |

---

## TypeScript Support

The SDK is written in TypeScript and exports all public types. No `@types` package needed.

```ts
import type {
  AddUserParams,
  CreateWaitlistParams,
  UpdateUserStatusParams,
  UpdateWaitlistParams,
  UserCountResponse,
  UserSource,
  UserStatus,
  WaitlistResponse,
  WaitlistUserResponse,
  WebhookConfig,
  ZotSDKConfig,
} from "zot-sdk";
```

---

## API Reference

### `new ZotSDK(config)`

Creates a new SDK client.

### `zot.waitlists`

| Method     | Returns                       | Description                        |
| ---------- | ----------------------------- | ---------------------------------- |
| `create()` | `Promise<WaitlistResponse>`   | Create a new waitlist.             |
| `list()`   | `Promise<WaitlistResponse[]>` | List all waitlists on the account. |

### `zot.waitlist(id)`

| Method                 | Returns                            | Description                        |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| `get()`                | `Promise<WaitlistResponse>`        | Fetch this waitlist's details.     |
| `update(params)`       | `Promise<WaitlistResponse>`        | Update waitlist settings.          |
| `delete()`             | `Promise<void>`                    | Permanently delete this waitlist.  |
| `stats()`              | `Promise<Record<string, unknown>>` | Aggregated waitlist stats.         |
| `webhookEvents()`      | `Promise<unknown[]>`               | Webhook delivery history.          |
| `addUser(params)`      | `Promise<WaitlistUserResponse>`    | Register a new user.               |
| `listUsers()`          | `Promise<WaitlistUserResponse[]>`  | List all users on this waitlist.   |
| `userCount()`          | `Promise<UserCountResponse>`       | Total + referred user counts.      |
| `searchUser(email)`    | `Promise<WaitlistUserResponse>`    | Find a user by email.              |
| `updateUserStatus(p)`  | `Promise<void>`                    | Change a user's status.            |
| `bulkDeleteUsers(e)`   | `Promise<void>`                    | Delete one or many users by email. |
| `blockedUsers()`       | `Promise<WaitlistUserResponse[]>`  | List blocked users.                |
| `blockedUserCount()`   | `Promise<{ total: number }>`       | Count of blocked users.            |

---

## License

MIT © Zot
