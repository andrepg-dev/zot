# Architecture Blueprint

This document is a self-contained specification of the architecture used in the Zot project. It is written for an LLM (or a developer) so it can replicate the same structure in a new project from scratch, and so that it can also be used as the canonical reference when working inside the Zot repo itself.

The goal: a Turborepo monorepo with a NestJS API, a Next.js App Router client, optional landing page, and a `shared` package that holds the Zod schemas + types reused by both sides. The data flow is `Mongo (Mongoose) -> NestJS controllers -> Next.js server actions -> TanStack Query -> React components`.

---

## 1. High-level layout

```
<root>/
├── package.json              # npm workspaces + turbo
├── turbo.json
├── tsconfig.base.json
├── apps/
│   ├── api/                  # NestJS 11 backend (port 3010)
│   ├── client/               # Next.js 16 dashboard (port 3000)
│   └── landing-page/         # Next.js 16 marketing site (port 3001) [optional]
└── packages/
    ├── shared/               # Zod schemas + utility functions (no React)
    └── design-system/        # Optional component library w/ Storybook + tsup
```

Workspaces declared in root `package.json`:

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": { "dev": "turbo dev", "build": "turbo build" },
  "devDependencies": { "turbo": "^2.8.3" }
}
```

`turbo.json` declares `dev`, `build`, `build:lib`, `check-types`. `dev` depends on `^build:lib` so the shared package is compiled before apps start.

Path aliases (root `tsconfig.base.json` extended by each app):

- `@repo/*` for any workspace package (e.g. `@repo/packages/shared/schemas`).
- `@/*` inside each Next.js app (root of the app).
- `@api/*` inside the NestJS app (root of `apps/api`).

---

## 2. The contract layer: `packages/shared`

The whole architecture revolves around a single source of truth for data shapes: **Zod schemas in `packages/shared/schemas/`**, organized by feature.

```
packages/shared/
├── package.json              # name: "@repo/packages/shared", main: schemas/index.ts
├── tsconfig.json
├── libs/utils.ts             # zMongoId helper, etc.
└── schemas/
    ├── index.ts              # re-exports every feature
    ├── <feature>/<feature>.zod.ts
    └── ...
```

Rules:

1. **All Zod schemas live here. Never inline a schema in a component or action.**
2. Each feature exports: `create<Feature>Schema`, `update<Feature>Schema = create.partial()`, `<feature>ResponseSchema`, plus inferred types `Create<Feature>Values`, `Update<Feature>Values`, `<Feature>Response`.
3. `schemas/index.ts` re-exports everything so consumers do `import { CreateXValues } from "@repo/packages/shared/schemas"`.
4. The shared package has no React, no Node-only deps; it must be importable from both server (NestJS) and client (Next.js).

Example (`schemas/wait-list/wait-list.zod.ts`):

```ts
import { z } from "zod";
import { zMongoId } from "../../libs/utils";

export const createWaitListSchema = z.object({
  name: z.string().min(1),
  sendEmailToNewSignup: z.boolean().optional(),
  webhook: z.object({ url: z.string().url(), range: z.number().int().min(1) }).optional(),
  isAvailable: z.boolean().optional(),
});

export const updateWaitListSchema = createWaitListSchema.partial();

export const waitListResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  isAvailable: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateWaitListValues = z.infer<typeof createWaitListSchema>;
export type UpdateWaitListValues = z.infer<typeof updateWaitListSchema>;
export type WaitListResponse = z.infer<typeof waitListResponseSchema>;
```

---

## 3. Backend: NestJS API (`apps/api`)

### 3.1 Layout

```
apps/api/src/
├── main.ts                   # bootstrap: ValidationPipe, cookieParser, versioning, Swagger, CORS
├── app.module.ts             # imports ConfigModule, MongooseModule, V1Module
├── config/
│   ├── env.config.ts
│   └── mongodb.config.ts
├── common/
│   ├── decorators/           # e.g. UserId() pulls the JWT user id from the request
│   ├── error-handling/
│   ├── jwt-services/
│   ├── cookies.service.ts
│   ├── saveJWT-in-cookies.service.ts
│   └── data-transform/
├── constants/
└── v1/
    ├── app.module.ts         # imports every feature module + APP_GUARD
    ├── auth/                 # passport JWT (Google, GitHub, local), guards, strategies
    ├── users/
    ├── wait-list/            # the canonical feature shape — see 3.3
    ├── emails/
    ├── email-templates/
    ├── subscriptions/        # Stripe
    ├── api-key/
    ├── feedback/
    ├── general-stats/
    ├── react-to-html/
    └── core/                 # cross-feature internal services (s3, email-sending, email-security)
```

### 3.2 Bootstrap (`main.ts`) essentials

- `NestFactory.create(AppModule, { rawBody: true })` (rawBody for Stripe webhooks).
- Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
- `cookie-parser` middleware.
- URI versioning: `app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" })`.
- Swagger at `/docs`, with `addBearerAuth(..., "JWT-auth")` and `setVersion("1.0.0")`. Document is also written to `./openapi.json` so the client SDK can be generated.
- CORS with strict origins, but with a regex allowlist for public SDK routes (e.g. `^/v\d+/wait-list/[^/]+/user/?$`) that should be open and credential-less.

### 3.3 Feature module shape — the canonical pattern

Every feature folder under `v1/` follows this shape (using `wait-list` as the model):

```
v1/wait-list/
├── wait-list.module.ts
├── wait-list.controller.ts
├── wait-list.service.ts
├── wait-list.controller.spec.ts
├── dto/
│   ├── create-wait-list.dto.ts
│   ├── update-wait-list.dto.ts
│   └── wait-list-response.dto.ts
├── schemas/
│   ├── wait-list.schema.ts            # Mongoose @Schema class
│   └── ...
├── stats/                              # nested sub-feature (own module)
└── wait-list-user/                     # nested sub-feature (own controller/service/dto)
```

**Module:**

```ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitList.name, schema: WaitListSchema },
      { name: WaitListUser.name, schema: WaitListUserSchema },
    ]),
    UsersModule, // import the modules whose services you need to inject
  ],
  controllers: [WaitListController],
  providers: [WaitListService],
  exports: [WaitListService, MongooseModule],
})
export class WaitListModule {}
```

**Controller:**

- `@Controller({ path: "wait-list", version: "1" })` + `@ApiTags(...)` + `@ApiBearerAuth("JWT-auth")`.
- Pulls user id with the custom `@UserId()` decorator (see `common/decorators/`).
- Validates Mongo ids via `ParseObjectIdPipe` from `@nestjs/mongoose`.
- Every endpoint annotated with `@ApiOperation`, `@ApiOkResponse({ type: ResponseDto })`, etc., so the generated OpenAPI is high quality.
- Standard REST shape: `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`. Sub-resources are nested (`GET /:id/webhook-events`).

**DTO:**

- One DTO per request shape. Decorated with `class-validator` (`@IsString`, `@IsBoolean`, `@IsMongoId`, `@ValidateNested`, etc.) and `@nestjs/swagger` (`@ApiProperty`, `@ApiPropertyOptional`).
- The DTO is the runtime validator used by the global `ValidationPipe`. The Zod schema in `packages/shared` is the same shape but used by the client. They are intentionally duplicated — the API enforces with class-validator, the client enforces with Zod, and the contract is kept consistent by hand or by codegen.

**Mongoose schema (`schemas/<feature>.schema.ts`):**

```ts
@Schema({ timestamps: true, versionKey: false, id: false })
export class WaitList {
  @Prop({ type: Types.ObjectId, ref: "user", required: true, index: true, select: false })
  owner: Types.ObjectId;

  @Prop({ required: true }) name: string;
  @Prop({ required: true, default: true }) isAvailable: boolean;
}
export const WaitListSchema = SchemaFactory.createForClass(WaitList);
```

Conventions: `timestamps: true`, `versionKey: false`, the `owner` field is `select: false` (hidden by default) and indexed; ownership filter is applied on every query.

**Service:**

- Injects models with `@InjectModel(WaitList.name) private WaitListModel: Model<WaitList>`.
- Every read/write filters by `owner` to enforce per-user isolation.
- Throws `HttpException(message, HttpStatus.X)`. Wraps non-HttpException errors in a generic 500 (`if (error instanceof HttpException) throw error; throw new HttpException("Error ...", 500)`).
- Aggregations (`$lookup`, `$addFields`, `$project`) are used directly in the service when a list endpoint needs joined counts.
- For cascading deletes the service deletes related collections explicitly (no Mongoose hooks).

### 3.4 Auth

- JWT (Passport) with three strategies: local, Google, GitHub.
- A composite guard registered as `APP_GUARD` in `v1/app.module.ts`:
  ```ts
  { provide: APP_GUARD, useClass: CompositeAuthGuard }
  ```
  It tries the API-key guard first (for SDK routes) and falls back to the JWT guard. So **everything under `/v1/*` is protected by default** unless a route is explicitly marked public.
- Tokens are issued as **httpOnly cookies**: `access_token` (1h) and `refresh_token` (7d). A `/auth/refresh-token` endpoint rotates them.
- A `@UserId()` decorator returns `Types.ObjectId` from `req.user`.

### 3.5 Cross-feature services

`v1/core/` holds services that are imported by multiple feature modules (e.g. `email-sending`, `email-security`, `aws/s3`). They are registered as providers in the consuming module rather than being a global module.

---

## 4. Frontend: Next.js client (`apps/client`)

### 4.1 Layout

```
apps/client/
├── middleware.ts             # cookie-based auth gate
├── next.config.js
├── instrumentation.ts        # Sentry + PostHog server init
├── instrumentation-client.ts
├── app/
│   ├── layout.tsx            # root html/body, fonts, providers
│   ├── providers.tsx         # HeroUIProvider + next-themes
│   ├── page.tsx              # public entry
│   ├── login/, signup/       # public auth pages
│   ├── api/                  # Next.js route handlers (e.g. OAuth callback)
│   └── (root-layout)/        # route group: every authenticated page
│       ├── layout.tsx        # header + sidebar
│       └── app/
│           ├── dashboard/
│           ├── <feature>/
│           └── ...
├── actions/                  # "use server" — one folder per feature, mirrors API features
├── components/
│   ├── form.tsx              # global Form wrapper (handles error toasts)
│   ├── form-field.tsx
│   ├── type.tsx              # typography component (variants: h1, h4, h6, base, sm)
│   ├── query-provider.tsx    # TanStack QueryClientProvider
│   ├── global/               # button, title, stepper, ...
│   ├── layouts/              # PageComponent etc.
│   ├── navigation/           # header.navigation, sidebar.navigation
│   ├── ui/                   # input, chip, code-block, ...
│   ├── skeletons/            # shared skeletons (type, chip, button, input, ...)
│   └── <feature>/            # feature-scoped components
├── hooks/
├── lib/
│   ├── api/fetch-wrapper.ts  # the only HTTP client
│   ├── utils.ts              # cn() = clsx + tailwind-merge
│   └── format-date.ts
├── store/                    # Zustand stores (UI state only)
├── theme/, styles/, public/
└── tailwind.config.js        # CSS-variable based theme
```

### 4.2 Routing

- Next.js 16 App Router. A single route group `(root-layout)` wraps every authenticated page in the header + sidebar layout. Public routes (`/setup-waitlist`, `/signup`, `/api/*`) live outside it.
- Dynamic route params are async:
  ```tsx
  export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
  }
  ```

### 4.3 Auth middleware (`middleware.ts`)

- Reads `refresh_token` cookie. If a user without the cookie hits anything other than `/setup-waitlist` or `/signup`, redirect to `/setup-waitlist?returnTo=...`. If a user *with* the cookie hits an auth route, redirect to `/app/dashboard` (or `returnTo`).
- `safeReturnTo` rejects values that don't start with a single `/` to prevent open redirects.
- `matcher: ["/app/:path*", "/setup-waitlist", "/signup"]`.

### 4.4 The `FetchWrapper` (the heart of data flow)

`lib/api/fetch-wrapper.ts` is the single typed HTTP client. **Every server action calls this and only this.**

Responsibilities:

1. Read `access_token` from `next/headers` cookies and forward as a `Cookie` header to the backend.
2. Set `Content-Type: application/json` for `POST/PATCH/PUT` unless the body is `FormData`.
3. On `401`, call `/auth/refresh-token` once with the `refresh_token`. If it succeeds, parse the new tokens out of `set-cookie`, write them back to the Next.js cookie store with the right TTLs (`access_token: 3600s`, `refresh_token: 7*24*3600s`), retry the original request once.
4. On non-2xx, throw `ApiError(status, message, data)`.
5. Special `isLogging: true` mode (only used by login/register actions) extracts `set-cookie` from the auth response and writes the tokens to the Next.js cookie store.

The wrapper is generic: `FetchWrapper<T>(endpoint, options?, isLogging?) => Promise<T>`. It calls `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`.

### 4.5 Server actions (`actions/<feature>/<feature>.actions.ts`)

Conventions:

- File starts with `"use server";`.
- One file per resource, named `<resource>.actions.ts`.
- Function names are plain verbs: `getX`, `getXById`, `createX`, `updateX`, `deleteX`. **Never** suffix with `Action` (do not write `createXAction`).
- Types come from `@repo/packages/shared/schemas`.
- Body is a thin wrapper around `FetchWrapper`.

Canonical example (`actions/wait-list/wait-list.actions.ts`):

```ts
"use server";
import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type {
  CreateWaitListValues,
  UpdateWaitListValues,
  WaitListResponse,
} from "@repo/packages/shared/schemas";

export async function createWaitList(data: CreateWaitListValues) {
  return await FetchWrapper<WaitListResponse>("/wait-list", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getWaitLists() {
  return await FetchWrapper<WaitListResponse[]>("/wait-list");
}

export async function getWaitListById(id: string) {
  return await FetchWrapper<WaitListResponse>(`/wait-list/${id}`);
}

export async function updateWaitList(id: string, data: UpdateWaitListValues) {
  return await FetchWrapper<WaitListResponse>(`/wait-list/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteWaitList(id: string) {
  return await FetchWrapper(`/wait-list/${id}`, { method: "DELETE" });
}
```

### 4.6 TanStack Query — server state

- All server state lives in TanStack Query. **Zustand is for UI-only state** (sidebar open/closed, hover sync, etc.) — never for data fetched from the API.
- Reads use `useQuery`; writes use `useMutation`. Use `isPending` (not `isLoading`) for loading states.
- After mutations, invalidate the relevant query key. The detail-page convention is **one shared key per resource id** (e.g. `[id]`) so the layout and all sub-pages share the same cache entry.
- Errors are handled via `onError` callbacks (toast) or via `error`/`isError` from the hook, never with a try/catch in the hook callsite.
- The `QueryClientProvider` lives in `components/query-provider.tsx` and wraps the tree from the root layout.

```tsx
const queryClient = useQueryClient();
const { data } = useQuery({ queryKey: [id], queryFn: () => getWaitListById(id) });
const { mutate, isPending } = useMutation({
  mutationFn: (values: UpdateWaitListValues) => updateWaitList(id, values),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [id] });
    addToast({ description: "Updated", color: "success" });
  },
  onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" }),
});
```

### 4.7 Forms — React Hook Form + Zod

**Always** React Hook Form + Zod. Never re-invent.

- Resolver: `zodResolver(<schema>)`. Schemas come from `@repo/packages/shared/schemas`, or a page-local schema that wraps the shared one if you need to apply a transform (e.g. strip `https://` from a URL). Do not inline shared field shapes.
- For server-synced forms (settings/edit pages): pass `values` (not `defaultValues`) to `useForm` so the form re-syncs when the query data arrives or changes.
- `register()` for plain inputs (`InputComponent` supports ref-based control). `Controller` for controlled HeroUI components like `Switch` (`isSelected` / `onValueChange`).
- Wrap the form with the global `<Form error={mutation.error}>` — it surfaces error messages as toasts automatically.
- Always show toast on create / update / delete.
- Destructive operations (delete) **require a confirmation dialog**. Never delete on direct click.
- Buttons use `isLoading={isPending}`. Do NOT swap the button label (`isPending ? "Saving" : "Save"` is wrong).

### 4.8 Visual hierarchy (UI conventions)

This codebase has strict UI conventions. Replicate them in any new project that uses HeroUI + Tailwind 4.

- **Typography** via `<Type variant="...">` (`type.tsx`):
  - `h1`: `text-xl font-normal`
  - `h4`: `text-base font-medium` (most common section title)
  - `h6`: `text-sm font-medium`
  - `base`: `text-sm` (body)
  - `sm`: `text-xs` — only when the UI specifically needs small text.
- **Colors**: `text-foreground` (default), `text-muted-foreground` for secondary text. Borders over shadows.
- **Page shell**: `<PageComponent>` (`p-6 text-sm`) with `<Title description="...">Page Title</Title>`.
- **HeroUI radius rules**:
  - `radius="none"` on `Card`, `Table`, `Modal`, `Drawer`.
  - `radius="sm"` on `Button` and `Input` only.
  - All other containers are `rounded-none`.
- **Tables**: standard pattern with `radius="none"`, `selectionMode="multiple"`, `checkboxesProps={{ size: "sm", classNames: { wrapper: "before:border-1" } }}`, and `classNames={{ th: "!rounded-b-none", wrapper: "p-0 border", td: "first:before:rounded-none last:before:rounded-e-none cursor-pointer py-3" }}`.
- **Empty states**: always wrap `emptyContent` of `TableBody` in `<Type>` (e.g. `emptyContent={<Type>No items yet.</Type>}`). Never plain strings.
- **Drawer headers**: description text inside `DrawerHeader` is always `font-normal` — `<p className="text-sm text-muted-foreground font-normal">`.
- **Buttons**: default `size="sm"`, `radius="sm"`, ripple disabled via the local `GlobalButton` wrapper.
- **Chips**: `rounded-full text-[10px]` with status variants `active | warning | danger | primary | neutral`.
- **Spacing scale**: `gap-2 / 3 / 4 / 6`. Icons: `size-4 / 5` for UI, `size-3` inline.
- **Skeletons** in `components/skeletons/` cover type, chip, button, input, textarea, switch, checkbox, and feature cards. Use them selectively. Only build a custom one if none fits.
- **Date formatting**: always `toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })` → `Mar 10, 2026`.
- **No em-dashes** in READMEs, prose, comments. Use a regular hyphen or rephrase.

### 4.9 Code style

- Prettier: double quotes, semicolons, 100 char width, trailing commas off.
- ESLint: import ordering enforced, padding between statements required.
- `cn(...)` from `lib/utils.ts` (clsx + tailwind-merge) for conditional classes.

---

## 5. End-to-end data flow (the canonical loop)

For any feature `<F>`, the work splits cleanly:

1. **Schema** (`packages/shared/schemas/<F>/<F>.zod.ts`) — `create<F>Schema`, `update<F>Schema`, `<F>ResponseSchema`, plus inferred types. Re-export from `schemas/index.ts`.
2. **Backend module** (`apps/api/src/v1/<F>/`):
   - Mongoose schema with `owner` indexed and `select: false`.
   - DTOs decorated with class-validator + Swagger (mirror of the Zod schema).
   - Service that filters every query by `owner`, throws `HttpException`, wraps unknown errors in 500.
   - Controller with `@Controller({ path: "<F>", version: "1" })`, `@ApiTags`, `@ApiBearerAuth("JWT-auth")`, full Swagger annotations, `@UserId()` for the user id, `ParseObjectIdPipe` for ids.
   - Module imports `MongooseModule.forFeature([...])` and any other feature modules whose services it injects.
   - Register the module in `v1/app.module.ts`.
3. **Frontend actions** (`apps/client/actions/<F>/<F>.actions.ts`) — `"use server"`, one function per endpoint, returning `FetchWrapper<T>(...)` with types from `@repo/packages/shared/schemas`.
4. **Frontend page/component** — `useQuery` for reads, `useMutation` for writes; React Hook Form + `zodResolver(<F>Schema)` for forms; toasts on every mutation; confirmation modals for deletes; HeroUI components with the radius and visual rules above.

If any of those four layers is missing, the feature isn't done.

---

## 6. Environment & dev workflow

- **MongoDB** runs locally via `docker compose up -d` from `apps/api/`.
- Per-app `.env` files. Keys:
  - API: `MONGODB_DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`, `RESEND_API_KEY`, Stripe keys.
  - Client: `NEXT_PUBLIC_BACKEND_URL` (defaults to `http://localhost:3010/v1`).
  - Landing: `NEXT_PUBLIC_FRONTEND_APP_URL`.
- Top-level commands: `npm run dev` (turbo), `npm run build`, `npm run check-types`, `npm run lint`.
- API: `npm run dev | test | test:watch | test:cov | test:e2e | lint | format`.
- Client: `npm run dev` (`next dev --turbopack -p 3000`).
- Landing: `npm run dev` (`next dev --turbopack -p 3001`).

---

## 7. Reproduction checklist for a new project

If asked to scaffold a new app with this architecture, do all of these:

1. Initialize npm workspaces + Turbo at the root with `apps/*` and `packages/*`.
2. Create `packages/shared` with `schemas/` and `libs/` as described in section 2. No React, no Node-only deps.
3. Create `apps/api` with NestJS 11, Mongoose, Passport JWT, class-validator, Swagger. Wire up:
   - Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
   - `cookie-parser`.
   - URI versioning `defaultVersion: "1"`.
   - Swagger at `/docs` with bearer auth and `openapi.json` written to disk.
   - CORS strict allowlist + a regex carve-out for any public SDK routes.
   - A `CompositeAuthGuard` registered as `APP_GUARD` so everything is protected by default.
   - `@UserId()` decorator that reads `req.user._id` (or whatever your strategy puts there).
4. Create `apps/client` with Next.js 16, App Router, HeroUI, TailwindCSS 4, TanStack Query, React Hook Form, Zod, next-themes. Wire up:
   - `(root-layout)` route group for authenticated pages.
   - `middleware.ts` cookie gate with `safeReturnTo`.
   - `lib/api/fetch-wrapper.ts` exactly as in section 4.4.
   - `components/query-provider.tsx` and a global `<Form>` that surfaces errors as toasts.
   - `components/type.tsx`, `components/global/button.tsx` (`GlobalButton`), `components/layouts/page-component.tsx`, `components/global/title.tsx`, `components/ui/chip.tsx`, plus the skeletons set listed in 4.8.
5. For each feature, follow the four-layer loop in section 5.
6. Enforce all UI conventions in section 4.8 from day one — they're load-bearing for visual consistency.

---

## 8. What to avoid

- Inlining Zod schemas in components or actions. Always go through `packages/shared`.
- Naming server actions `createXAction`. Use `createX`.
- Using `isLoading` from TanStack Query. Use `isPending`.
- Putting server data in Zustand. Zustand is UI-only.
- Calling `fetch` directly from the client. Always go through `FetchWrapper` from a `"use server"` action.
- Deleting records without a confirmation dialog.
- Swapping button labels on loading state. Use `isLoading={isPending}` and keep the label fixed.
- Using `<Type variant="sm">` for general body content.
- Em-dashes in any prose, README, or comment.
- Skipping Swagger annotations on a controller endpoint. Every endpoint must have `@ApiOperation` + a typed response decorator.
- Querying Mongoose without filtering by `owner`. Every read and write is per-user.
