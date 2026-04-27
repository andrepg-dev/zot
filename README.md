<p align="center">
  <img src="./apps/landing-page/public/zot-icon.svg" alt="Zot logo" width="72" height="72" />
</p>

<h1 align="center">Zot</h1>

<p align="center">
  The platform for <strong>waitlists</strong>, emails and subscriptions.<br/>
  A Turborepo monorepo with the API, the dashboard, the landing site and every public npm package.
</p>

<p align="center">
  <a href="https://zot.so">zot.so</a> ·
  <a href="https://app.zot.so">app.zot.so</a> ·
  <a href="https://app.zot.so/app/api-keys">Get an API key</a>
</p>

---

## What is Zot?

Zot lets you **capture emails, manage waitlists and automate onboarding** without building your own database, admin panel, transactional emails and SDK from scratch. You integrate with Zot through four surfaces:

- **A hosted UI** at [app.zot.so](https://app.zot.so) to create waitlists and inspect signups.
- **An official SDK** ([`@zot-core/sdk`](./packages/SDK)) for Node, edge runtimes, React and Next.js.
- **A CLI** ([`@zot-core/cli`](./packages/cli)) to create resources straight from the terminal.
- **An AI agent skill** ([`@zot-core/agents`](./packages/agents-cli)) that teaches Claude Code, Cursor, GitHub Copilot and any `AGENTS.md`-aware agent how to integrate Zot correctly without hallucinating.

---

## Monorepo layout

```
zot/
├── apps/
│   ├── api              NestJS 11 · MongoDB · Passport JWT · Stripe · Resend
│   ├── client           Next.js 16 · HeroUI · TanStack Query · Zustand
│   └── landing-page     Next.js 16 · Three.js · GSAP · Framer Motion
└── packages/
    ├── SDK              `@zot-core/sdk`     — official TypeScript SDK (server + React)
    ├── cli              `@zot-core/cli`     — API CLI (oclif)
    ├── agents-cli       `@zot-core/agents`  — installs agent skills into any repo
    ├── skills/          canonical SKILL.md files consumed by `@zot-core/agents`
    └── shared           Zod schemas and utilities shared across apps
```

### Apps

| App                 | Port   | Stack                                                                           | What it does                                          |
| ------------------- | ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `apps/api`          | `3010` | NestJS 11, MongoDB/Mongoose, Passport JWT (Google/GitHub/local), Stripe, Resend | Backend API. Swagger at `/docs`.                      |
| `apps/client`       | `3000` | Next.js 16, HeroUI, Tailwind 4, TanStack Query, Zustand, React Hook Form + Zod  | Authenticated dashboard. Proxies `/api/*` to the API. |
| `apps/landing-page` | `3001` | Next.js 16, Three.js, GSAP, Framer Motion                                       | Public marketing site.                                |

### Packages published to npm

| Package                                      | Version                                                                              | What it's for                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| [`@zot-core/sdk`](./packages/SDK)            | ![npm](https://img.shields.io/npm/v/@zot-core/sdk.svg?label=&color=black)            | Official SDK. `new ZotSDK({ apiKey })` on the server, `useAddUser` hook on the client.                  |
| [`@zot-core/cli`](./packages/cli)            | ![npm](https://img.shields.io/npm/v/@zot-core/cli.svg?label=&color=black)            | CLI for the Zot API. `npx @zot-core/cli waitlist create --name "Early Access"`.                         |
| [`@zot-core/agents`](./packages/agents-cli)  | ![npm](https://img.shields.io/npm/v/@zot-core/agents.svg?label=&color=black)         | Installs the official integration guides into your repo so every AI agent integrates Zot the right way. |

---

## Using Zot in your project

The recommended path from zero to a working waitlist in a Next.js app:

```bash
# 1. Install the SDK
npm install @zot-core/sdk

# 2. Create the waitlist and persist its ID in .env.local
#    (requires ZOT_API_KEY — grab one at https://app.zot.so/app/api-keys)
npx @zot-core/cli waitlist create --name "Early Access" --write-env .env.local --public

# 3. (Optional) Teach the AI agents in this repo how to use Zot
npx skills add launch-waitlist-zot/zot-skills
```

Then, in a client component:

```tsx
"use client";
import { useAddUser } from "@zot-core/sdk/react";

export function WaitlistForm() {
  const { addUser, isPending, isUserRegistered, error } = useAddUser({
    apiKey: process.env.NEXT_PUBLIC_ZOT_API_KEY!,
    waitlistId: process.env.NEXT_PUBLIC_ZOT_WAITLIST_ID!,
  });
  // ...
}
```

The full guide (server, client, error handling, anti-patterns) lives at [`packages/skills/zot-waitlist/SKILL.md`](./packages/skills/zot-waitlist/SKILL.md).

---

## Local development

### Requirements

- **Node.js** `>= 18` (22 recommended)
- **npm** `>= 10`
- **MongoDB** running locally or reachable via a URI (for the API)
- Environment variables per app (see `apps/*/.env.example`)

### Install

```bash
git clone git@github.com:<org>/zot.git
cd zot
npm install
```

### Root commands

```bash
npm run dev           # Run every app in parallel via Turborepo
npm run build         # Build the entire monorepo
npm run lint          # Lint every workspace
npm run check-types   # Type-check every workspace
```

### Per-app commands

```bash
# API (apps/api)
npm run -w api dev           # nest start --watch (port 3010)
npm run -w api test          # Jest
npm run -w api test:cov      # Jest + coverage

# Client (apps/client)
npm run -w client dev        # Next.js (port 3000)
npm run -w client build
npm run -w client start

# Landing (apps/landing-page)
npm run -w landing-page dev  # Next.js (port 3001)
```

### Building the public packages

```bash
npm run -w @zot-core/sdk    build
npm run -w @zot-core/cli    build
npm run -w @zot-core/agents build
```

---

## Publishing (maintainers)

All three packages live under the [`@zot-core`](https://www.npmjs.com/org/zot-core) npm scope. Scoped packages need `--access public` on the first publish.

The order matters because `@zot-core/cli` depends on `@zot-core/sdk`:

```bash
# 1. SDK first
npm version patch -w @zot-core/sdk
npm publish --workspace @zot-core/sdk --access public

# 2. CLI (pin the new SDK version in packages/cli/package.json first)
npm version patch -w @zot-core/cli
npm publish --workspace @zot-core/cli --access public

# 3. Agents CLI (ships the bundled SKILL.md)
npm version patch -w @zot-core/agents
npm publish --workspace @zot-core/agents --access public
```

Smoke test from a clean directory:

```bash
mkdir /tmp/zot-smoke && cd /tmp/zot-smoke
npx skills add launch-waitlist-zot/zot-skills
npx @zot-core/cli@latest waitlist create --help
```

### Legacy `zot-sdk`

The previous, unscoped package `zot-sdk` was published up to `v0.0.7` and lives on in npm for historical reasons. New releases only go out under `@zot-core/sdk`. After publishing `@zot-core/sdk@1.0.0`, deprecate the old package so existing users see a migration notice:

```bash
npm deprecate zot-sdk "Moved to @zot-core/sdk. Run: npm install @zot-core/sdk"
```

---

## Internal docs

- [`CLAUDE.md`](./CLAUDE.md) — repo-wide rules and conventions for Claude Code.
- [`apps/client/CLAUDE.md`](./apps/client/CLAUDE.md) — dashboard-specific conventions (HeroUI, React Hook Form + Zod, TanStack Query, toasts, skeletons, paths, naming).
- [`packages/SDK/README.md`](./packages/SDK/README.md) — SDK reference.
- [`packages/cli/README.md`](./packages/cli/README.md) — CLI reference.
- [`packages/agents-cli/README.md`](./packages/agents-cli/README.md) — available skills and how to publish new ones.
- [`packages/skills/zot-waitlist/SKILL.md`](./packages/skills/zot-waitlist/SKILL.md) — the canonical waitlist skill.

---

## Recommended workflow

1. Create a feature branch (`git checkout -b feature/<slug>`).
2. Work inside `apps/*` or `packages/*`; move shared logic into `packages/shared` when it makes sense.
3. Before committing: `npm run lint && npm run check-types`.
4. If you touched the SDK or a CLI, run `npm run build` in that workspace.
5. If you touched the skill (`packages/skills/zot-waitlist/SKILL.md`), rebuild `@zot-core/agents` so the bundled copy is regenerated.
6. Open a PR against `main`.

---

## License

Released under the terms of the [`LICENSE`](./LICENSE) file.
