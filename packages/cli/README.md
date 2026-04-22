# zot-cli

Command-line interface for the [Zot](https://zot.so) API.

```bash
npx zot-cli waitlist create --name "Early Access" --write-env .env.local --public
```

## Install

```bash
npm install -g zot-cli        # global
npm install -D zot-cli        # as a devDependency
npx zot-cli <command>         # one-off
```

## Authentication

Every command needs a Zot API key. Resolution order:

1. `--api-key <key>` flag
2. `ZOT_API_KEY` environment variable
3. `.env.local` in the working directory
4. `.env` in the working directory

Get your key at **https://zot.so → Settings → API Keys**.

## Commands

### `zot-cli waitlist create`

Create a waitlist via the API and optionally persist its ID into a `.env` file.

```bash
zot-cli waitlist create --name "Early Access"
zot-cli waitlist create --name "Early Access" --write-env .env.local
zot-cli waitlist create --name "Early Access" --write-env .env.local --public
zot-cli waitlist create --name "Quiet"        --no-send-email
zot-cli waitlist create --name "Scripted"     --json
```

| Flag | Default | Description |
| --- | --- | --- |
| `--name` | _(required)_ | Waitlist name. |
| `--api-key` | `$ZOT_API_KEY` | Override the resolved API key. |
| `--send-email` / `--no-send-email` | `true` | Send a welcome email to new signups. |
| `--write-env <file>` | _none_ | Upsert `ZOT_WAITLIST_ID` into that env file. |
| `--public` | `false` | Also write `NEXT_PUBLIC_ZOT_WAITLIST_ID` (requires `--write-env`). |
| `--cwd <dir>` | `process.cwd()` | Working directory for env resolution / writing. |
| `--json` | | Emit the waitlist JSON instead of a formatted summary. |

Standard [oclif](https://oclif.io) flags like `--help`, `-h`, `-v` work everywhere.

## Related

- [`zot-sdk`](../SDK/README.md) — the TypeScript SDK the CLI wraps.
- [`zot-agents`](../agents-cli/README.md) — configure AI coding agents
  (Claude Code, Cursor, Copilot, AGENTS.md) with Zot integration guides.
