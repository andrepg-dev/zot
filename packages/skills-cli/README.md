# zot-skills

The companion CLI for [Zot](https://zot.so). It does two things:

1. **Installs agent skills** so Claude Code, Cursor, GitHub Copilot, and any agent that reads `AGENTS.md` all know how to integrate Zot correctly.
2. **Creates Zot resources** (waitlists today, more later) directly from the terminal and writes the IDs into your `.env` so you skip the copy-paste step.

```bash
# Teach every agent in this project how to integrate Zot
npx zot-skills add waitlist-best-practices

# Create a waitlist and persist its ID in .env.local
npx zot-skills create waitlist --name "Early Access" --write-env .env.local --public
```

That is the whole onboarding flow.

## What gets installed

| Target | File written |
| --- | --- |
| Claude Code | `.claude/skills/<skill>/SKILL.md` |
| Cursor | `.cursor/rules/<skill>.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` (managed section) |
| AGENTS.md | `./AGENTS.md` (managed section) |

If none of those exist in your project, the CLI installs into all four so you're covered regardless of which agent you use later.

## Commands

### Skill commands

```bash
# Install a skill
npx zot-skills add waitlist-best-practices

# Only some targets
npx zot-skills add waitlist-best-practices --target claude,cursor

# Force overwrite
npx zot-skills add waitlist-best-practices --force

# List what is available (bundled + remote registry)
npx zot-skills list

# List only what ships inside this package (no network)
npx zot-skills list --local-only

# Remove from the project
npx zot-skills remove waitlist-best-practices
```

### Resource commands

```bash
# Create a waitlist and persist its ID in .env.local (server + NEXT_PUBLIC_ variant)
npx zot-skills create waitlist \
  --name "Early Access" \
  --write-env .env.local \
  --public

# Pure server stack — drop --public
npx zot-skills create waitlist --name "Beta list" --write-env .env

# Scriptable / non-interactive — print the raw API response
npx zot-skills create waitlist --name "Beta list" --api-key $ZOT_API_KEY --json

# Disable the default welcome email
npx zot-skills create waitlist --name "Quiet list" --no-send-email
```

The CLI resolves `ZOT_API_KEY` in this order: `--api-key` flag → `process.env.ZOT_API_KEY` → `.env.local` → `.env`. If none of those is set it exits with a clear error instead of calling the API.

## Options

### Skill commands (`add`, `remove`, `list`)

| Flag | Meaning |
| --- | --- |
| `--target <list>` | Comma-separated: `claude`, `cursor`, `copilot`, `agents-md`, or `all`. |
| `--cwd <path>` | Run in a different working directory. |
| `--yes`, `-y` | Skip the confirmation prompt. |
| `--force` | Overwrite existing files (for adapters that write discrete files). |
| `--registry <url>` | Override the remote registry URL. |
| `--local-only` | Use only the skills bundled inside this package. |

### `create waitlist`

| Flag | Meaning |
| --- | --- |
| `--name <string>` | Waitlist name (required). |
| `--api-key <key>` | Override `ZOT_API_KEY`. Falls back to env / `.env.local` / `.env`. |
| `--no-send-email` | Disable the default welcome email on new signups. |
| `--write-env <file>` | Upsert `ZOT_WAITLIST_ID=...` into the given env file. |
| `--public` | When used with `--write-env`, also writes `NEXT_PUBLIC_ZOT_WAITLIST_ID=...`. |
| `--json` | Print the raw API response instead of the formatted summary. |
| `--cwd <path>` | Working directory used for env resolution and `--write-env`. |

## Available skills

### `waitlist-best-practices`

Teaches the agent to integrate a Zot waitlist with the official `zot-sdk`:

- Picks `zot-sdk` for server code and `zot-sdk/react` (`useAddUser`) for React/Next.js.
- Sets up env vars (`ZOT_API_KEY`, `NEXT_PUBLIC_ZOT_API_KEY`).
- Canonical UI pattern with loading, persisted success state, and 409 handling.
- Lists anti-patterns to avoid (no raw `fetch`, no wrapping the hook in TanStack Query, etc.).
- Ends with a verification checklist the agent must confirm before marking the task done.

Run `npx zot-skills list` to see anything else available from the remote registry.

## For humans

Even without an agent, `.claude/skills/waitlist-best-practices/SKILL.md` (and its peers) are plain markdown files you can read and follow yourself.

## Remote registry

The CLI ships with every skill bundled inside the npm package, so it works offline. When online, it also fetches a remote `registry.json` and prefers newer versions if the maintainers publish updates between CLI releases.

Override with `--registry https://...` for private registries.

## License

MIT
