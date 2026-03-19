# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also the root [../../CLAUDE.md](../../CLAUDE.md) for monorepo-wide context.

## Commands

```bash
npm run dev      # next dev --turbopack -p 3000
npm run build    # Production build
npm run lint     # ESLint with --fix
npm start        # Start production server
```

Requires the API running on port 3010 (`apps/api`). No test runner is configured for this app.

## Architecture

### Routing

Next.js 16 App Router with a single route group `(root-layout)` that wraps all authenticated pages in a header + sidebar layout. Public routes (`/login`, `/api/auth/callback`) sit outside this group.

Dynamic routes use the Next.js 16 async params pattern:
```tsx
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
}
```

### Data Flow

- **Server actions** (`actions/`) — all mutations and data fetching go through `FetchWrapper` (see below). Organized by feature (auth, wait-list, subscriptions, emails, etc.). Function names do NOT use an "Action" suffix.
- **TanStack Query (React Query)** — all server state management. Server actions are wrapped with `useQuery` for reads and `useMutation` for writes. Use `isPending` (not the deprecated `isLoading`) for loading states. Handle errors via `onError` callbacks or the `error`/`isError` fields.
- **Zustand** (`store/`) — local UI state only (sidebar, header, chart hover sync). Not used for server data.

### FetchWrapper (`lib/api/fetch-wrapper.ts`)

Generic typed HTTP client that all server actions use. Key behaviors:
- Reads `access_token` from cookies and forwards it to the backend.
- On 401, automatically attempts token refresh using `refresh_token`, updates cookies, and retries the original request once.
- `isLogging` flag (used only by login/register) extracts tokens from the response `Set-Cookie` header and stores them.
- Throws `ApiError` with status, message, and response data on failure.

### Auth

JWT tokens in cookies: `access_token` (1h TTL) and `refresh_token` (7d TTL). Middleware (`middleware.ts`) checks `refresh_token` presence to gate `/app/*` routes and redirect authenticated users away from `/login`. OAuth callbacks (Google, GitHub) redirect through `/api/auth/callback`.

### UI Stack

- **HeroUI** components with dark theme by default.
- **TailwindCSS 4** with custom theme colors defined via CSS variables in `tailwind.config.js`.
- **Recharts** for all chart visualizations in `components/wait-list/charts/`. Charts share hover state via the `chart-hover` Zustand store.
- **Monaco Editor** for code editing (`components/editor/`).
- `cn()` utility from `lib/utils.ts` (clsx + tailwind-merge) for conditional classes.

### Forms

React Hook Form + Zod. Validation schemas are imported from `@repo/packages/shared/schemas` (the shared package). The `Form` component (`components/form.tsx`) wraps forms with error toast handling.

### Visual Hierarchy

Maintain these patterns for consistency across all pages and components:

**Typography** (`components/type.tsx`):
- h1: `text-xl font-normal` — Top-level headings
- h4: `text-base font-medium` — Page/section titles (most common)
- h6: `text-sm font-medium` — Small headings
- base: `text-sm` — Body text
- sm: `text-xs` — Secondary/metadata text

**Colors** (dark theme default):
- Primary text: `text-foreground` (implicit default)
- Secondary text: `text-muted-foreground` — descriptions, labels, captions
- Borders over shadows: thin 1px `border` using `--border` CSS variable

**Page structure**:
- Wrap pages in `<PageComponent>` (applies `p-6 text-sm`)
- Use `<Title description="...">Page Title</Title>` for page headers
- Content grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-X gap-4`
- Masonry: `columns-1 lg:columns-2 gap-6 space-y-6`

**Cards and containers**:
- `rounded-sm` (5px) everywhere — not `rounded-md` or `rounded-lg`
- Chart cards: `flex flex-col rounded-sm border px-5 py-4.5 bg-background`
- HeroUI cards: `<Card className="border" radius="sm">` with `<CardBody className="p-5">`

**Buttons**: default `size="sm"`, `radius="sm"`, ripple disabled via `GlobalButton`.

**Chips** (`components/ui/chip.tsx`): `rounded-full text-[10px]` with status variants — `active` (success), `warning`, `danger`, `primary`, `neutral`.

**Spacing scale**: `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px). Icons: `size-4`/`size-5` for UI, `size-3` inline.

**Skeletons** (`components/skeletons/`): existing skeletons for type, chip, button, input, textarea, switch, checkbox, and wait-list/card. Use them selectively where loading states are needed — not on every page. Only create a custom skeleton if none of the existing ones fit.

### Code Style

- Prettier: double quotes, semicolons, 100 char width, trailing commas off.
- ESLint: import ordering enforced, padding between statements required.
- Path aliases: `@/*` for app-local imports, `@repo/packages/*` for monorepo packages.
