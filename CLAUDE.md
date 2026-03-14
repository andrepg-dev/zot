# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zot is a platform for managing waitlists, emails, and subscriptions. It's an npm monorepo using Turborepo with four workspaces: a NestJS API, a Next.js dashboard client, a Next.js landing page, and a shared design system.

## Monorepo Structure

- **apps/api** — NestJS 11 backend (port 3010). MongoDB/Mongoose ORM, Passport JWT auth (Google, GitHub, local), Stripe payments, Resend emails. Swagger docs at `/docs`.
- **apps/client** — Next.js 16 dashboard (port 3000). HeroUI components, TailwindCSS 4, React Query, Zustand, React Hook Form + Zod. Proxies `/api/*` to backend.
- **apps/landing-page** — Next.js 16 marketing site (port 3001). Three.js, GSAP, Framer Motion for animations.
- **packages/shared** — Zod validation schemas and utility functions shared across apps.
- **packages/design-system** — Reusable component library with Storybook (port 6006). Built with tsup.

## Common Commands

```bash
# Root (Turborepo)
npm run dev            # Start all apps in dev mode
npm run build          # Build all apps
npm run check-types    # Type check all packages
npm run lint           # Lint all packages

# API (run from apps/api)
npm run dev            # nest start --watch
npm run test           # Jest unit tests
npm run test:watch     # Jest watch mode
npm run test:cov       # Jest with coverage
npm run test:e2e       # E2E tests (separate jest config: test/jest-e2e.json)
npm run lint           # ESLint with --fix
npm run format         # Prettier

# Client (run from apps/client)
npm run dev            # next dev --turbopack -p 3000

# Landing Page (run from apps/landing-page)
npm run dev            # next dev --turbopack -p 3001

# Design System (run from packages/design-system)
npm run dev            # Storybook dev on port 6006
npm run build:lib      # Build library with tsup
```

## Development Setup

MongoDB runs via Docker Compose in `apps/api/`:
```bash
docker compose up -d   # Start MongoDB on port 27017
```

Required environment variables are in `.env` files per app. Key ones:
- **API**: `MONGODB_DATABASE_URL`, `JWT_SECRET`, Google/GitHub OAuth credentials, `RESEND_API_KEY`, Stripe keys
- **Client**: `NEXT_PUBLIC_BACKEND_URL` (defaults to `http://localhost:3010/v1`)
- **Landing Page**: `NEXT_PUBLIC_FRONTEND_APP_URL`

## Architecture Notes

**Backend (NestJS):**
- URI-based API versioning (default: v1). All v1 routes are JWT-guarded.
- Feature-based module organization under `src/v1/`: auth, users, wait-list, subscriptions, emails, email-templates, payments, react-to-html.
- `src/common/` has shared error handling, JWT services, and decorators.
- Mongoose schemas define the data model (no Prisma in active use despite being in devDeps).

**Frontend (Next.js):**
- App Router with route groups: `app/(root-layout)/app/` contains feature routes (waitlist, emails, domains, dashboard, launches).
- Auth middleware at `apps/client/middleware.ts`.
- Zustand stores in `store/`, server actions in `actions/`, API client utilities in `lib/api/`.

**Path Aliases:**
- `@repo/*` — workspace packages
- `@/*` — app-local imports
- `@api/*` — API source imports

**Testing:** Jest for the API (`*.spec.ts` pattern). No test setup in frontend apps.
