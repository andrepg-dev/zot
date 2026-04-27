# @zot-core/agents

Configure any AI coding agent (Claude Code, Cursor, GitHub Copilot, `AGENTS.md`) to integrate [Zot](https://zot.so) correctly. One command writes the right guide files into your repo so every agent in the project knows how to use the Zot SDK without hallucinating.

```bash
# Teach every agent in this project how to integrate Zot
npx skills add launch-waitlist-zot/zot-skills
```

> Need to call the Zot API from the terminal (create a waitlist, manage API keys, etc.)?
> Use **[`@zot-core/cli`](../cli/README.md)** — it is the official CLI for Zot resources.
>
> ```bash
> npx @zot-core/cli waitlist create --name "Early Access" --write-env .env.local --public
> ```

`@zot-core/agents` only writes agent-guide files into your project. It does **not** talk to the Zot API.

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
npx skills add launch-waitlist-zot/zot-skills

# Only some targets
npx skills add launch-waitlist-zot/zot-skills --target claude,cursor

# Force overwrite (for discrete-file adapters)
npx skills add launch-waitlist-zot/zot-skills --force

# Skip the confirmation prompt (ideal for CI and agents)
npx skills add launch-waitlist-zot/zot-skills --yes

# List what is available (bundled + remote registry)
npx skills add launch-waitlist-zot/zot-skills

# List only what ships inside this package (no network)
npx skills add launch-waitlist-zot/zot-skills --local-only

# Remove from the project
npx skills add launch-waitlist-zot/zot-skills
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

### `waitlist`

Teaches the agent to integrate a Zot waitlist with the official `@zot-core/sdk`:

- Picks `@zot-core/sdk` for server code and `@zot-core/sdk/react` (`useAddUser`) for React/Next.js.
- Sets up env vars (`ZOT_API_KEY`, `NEXT_PUBLIC_ZOT_API_KEY`).
- Tells the agent to create the waitlist via `npx @zot-core/cli waitlist create` instead of code.
- Canonical UI pattern with loading, persisted success state, and 409 handling.
- Lists anti-patterns to avoid (no raw `fetch`, no wrapping the hook in TanStack Query, etc.).
- Ends with a verification checklist the agent must confirm before marking the task done.

Run `npx skills add launch-waitlist-zot/zot-skills` to see anything else available from the remote registry.

## For humans

Even without an agent, `.claude/skills/waitlist/SKILL.md` (and its peers) are plain markdown files you can read and follow yourself.

## Remote registry

The CLI ships with every skill bundled inside the npm package, so it works offline. When online, it also fetches a remote `registry.json` and prefers newer versions if the maintainers publish updates between CLI releases.

Override with `--registry https://...` for private registries.

## Related

- [`@zot-core/cli`](../cli/README.md) — official Zot API CLI (create waitlists, manage resources).
- [`@zot-core/sdk`](../SDK/README.md) — TypeScript SDK that both CLIs use under the hood.

## License

MIT
