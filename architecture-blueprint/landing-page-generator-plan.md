# Plan: AI landing page generator

Status: proposed, not started.

Goal: generate and edit landing pages from a chat brief, the way the email
generator works today, reusing the same editor experience rather than
introducing a second one.

## Why this is mostly a port of what exists

The email generator already solves the hard parts: a streaming agent loop with
tool use, version history, a sandboxed compile step, screenshot previews, and a
chat driven editor. A landing page generator differs in four places only:

1. what the model is told to produce (a Next.js page, not an email)
2. how the output is compiled and previewed (a real browser page, not inlined
   email HTML)
3. what "publish" means (a hosted route, not a saved template)
4. the design constraints (modern responsive CSS, not table layouts)

Everything else should be shared, not copied.

## Reuse map

| Concern | Reuse | Notes |
| --- | --- | --- |
| Agent loop, streaming, tool dispatch | `apps/api/src/v1/ai/generation/generation.service.ts` | Extract the turn runner so email and page generation share it |
| SSE transport | `apps/client/lib/api/email-stream.ts` + `/generation-stream` proxy | Rename to a neutral `generation-stream`; already generic |
| Chat UI | `EditorSidebar`, `ChatMessageList`, `ChatMessage`, `useAiChat` | Parameterise `useAiChat` by generation kind |
| Editor shell | `app/new/email/template` layout, Monaco, preview pane | Same shell, different preview renderer |
| Versions, quota, brand kit, skills | `generation-*` schemas and services | Add a `kind` discriminator rather than parallel collections |

## Backend work

1. **Add a `kind` field** (`email` | `page`) to `GenerationEmail` and rename it
   to a neutral `GenerationProject`, with a migration for existing rows. Keeps
   one pipeline instead of two.
2. **Split the system prompt.** `generation.prompts.ts` is email specific
   (table layouts, inline styles, Outlook fallbacks). Add a page prompt with
   modern layout rules, semantic sections, and responsive breakpoints. The tool
   contract (`emit_email` becomes `emit_document`) stays the same shape.
3. **New compile path.** Emails compile TSX to inlined HTML via
   `@react-email/render`. Pages should compile to a React component rendered
   with `renderToStaticMarkup` plus Tailwind, or be stored as source and
   rendered by a Next route. Do not reuse `juice`, which is email only.
4. **Preview screenshots** can reuse `ScreenshotService` unchanged, at a
   desktop viewport rather than 800x600.
5. **Publishing.** Decide between a dynamic route
   (`app/p/[slug]/page.tsx` reading stored source) and a static export per
   page. The dynamic route is far less work and matches the existing hosting.

## Frontend work

Reuse the editor at `app/new/email/template` by generalising it, rather than
adding a second screen. Concretely: make the route
`app/new/[kind]/page.tsx`, swap the preview pane by kind (email preview frame
vs full page iframe), and keep everything else identical. The chats list gains
a kind column and filter.

## Risks and open questions

- **Sandboxing.** Generated page code is richer than email code. The current
  `vm` sandbox with a regex denylist is already the weakest link; running
  arbitrary generated pages needs a stronger boundary than a denylist.
- **Tailwind at runtime.** Compiling Tailwind per generated page is slow. Ship
  a fixed stylesheet and constrain the model to a known class set.
- **Cost.** Pages are much larger than emails, so tokens per turn rise sharply.
  Revisit `GENERATION_DAILY_LIMIT` before enabling this.
- **Scope.** Doing this properly means refactoring the email pipeline to be
  kind aware first. Building a parallel page pipeline would double the surface
  and is the main thing to avoid.

## Suggested sequencing

1. Refactor generation to be kind aware, with email as the only kind. No user
   visible change, fully testable against current behaviour.
2. Add the page prompt and compile path behind a flag, no publishing yet.
3. Generalise the editor route and preview pane.
4. Add publishing and the public route.
5. Revisit sandboxing before any of this is exposed publicly.
