# zot-skills

Install [Zot](https://zot.so) agent skills into any project. One command writes the right guides for Claude Code, Cursor, GitHub Copilot, and `AGENTS.md` so every agent in the repo knows how to integrate Zot correctly.

```bash
# Teach every agent in this project how to integrate Zot
npx zot-skills add waitlist-best-practices
```

> Need to call the Zot API from the terminal (create a waitlist, manage API keys, etc.)?
> Use **[`zot-cli`](../cli/README.md)** — it is the official CLI for Zot resources.
>
> ```bash
> npx zot-cli waitlist create --name "Early Access" --write-env .env.local --public
> ```

`zot-skills` only writes agent-guide files into your project. It does **not** talk to the Zot API.

## What gets installed

| Target | File written |
| --- | --- |
| Claude Code | `.claude/skills/<skill>/SKILL.md` |
| Cursor | `.cursor/rules/<skill>.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` (managed section) |
| AGENTS.md | `./AGENTS.md` (managed section) |

If none of those exist in your project, the CLI installs into all four so you're covered regardless of which agent you use later.

## Commands

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

## Options

| Flag | Applies to | Meaning |
| --- | --- | --- |
| `--target <list>` | `add`, `remove` | Comma-separated: `claude`, `cursor`, `copilot`, `agents-md`, or `all`. |
| `--cwd <path>` | all | Run in a different working directory. |
| `--yes`, `-y` | `add`, `remove` | Skip the confirmation prompt. |
| `--force` | `add` | Overwrite existing files (for adapters that write discrete files). |
| `--registry <url>` | `add`, `list` | Override the remote registry URL. |
| `--local-only` | `add`, `list` | Use only the skills bundled inside this package. |

## Available skills

### `waitlist-best-practices`

Teaches the agent to integrate a Zot waitlist with the official `zot-sdk`:

- Picks `zot-sdk` for server code and `zot-sdk/react` (`useAddUser`) for React/Next.js.
- Sets up env vars (`ZOT_API_KEY`, `NEXT_PUBLIC_ZOT_API_KEY`).
- Tells the agent to create the waitlist via `npx zot-cli waitlist create` instead of code.
- Canonical UI pattern with loading, persisted success state, and 409 handling.
- Lists anti-patterns to avoid (no raw `fetch`, no wrapping the hook in TanStack Query, etc.).
- Ends with a verification checklist the agent must confirm before marking the task done.

Run `npx zot-skills list` to see anything else available from the remote registry.

## For humans

Even without an agent, `.claude/skills/waitlist-best-practices/SKILL.md` (and its peers) are plain markdown files you can read and follow yourself.

## Remote registry

The CLI ships with every skill bundled inside the npm package, so it works offline. When online, it also fetches a remote `registry.json` and prefers newer versions if the maintainers publish updates between CLI releases.

Override with `--registry https://...` for private registries.

## Related

- [`zot-cli`](../cli/README.md) — official Zot API CLI (create waitlists, manage resources).
- [`zot-sdk`](../SDK/README.md) — TypeScript SDK that both CLIs use under the hood.

## License

MIT
