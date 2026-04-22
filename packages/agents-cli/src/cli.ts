#!/usr/bin/env node
import { parseArgs } from "node:util";

import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { removeCommand } from "./commands/remove.js";
import { log } from "./ui.js";

const HELP = `
zot-agents — configure AI coding agents to integrate Zot correctly

Usage:
  npx zot-agents <command> [options]

Commands:
  add <skill>          Install a skill (e.g. waitlist)
  list                 List available skills
  remove <skill>       Remove an installed skill
  help                 Show this help

Options for \`add\` / \`remove\`:
  --target <list>      Comma-separated targets. Default: auto-detect.
                       Choices: claude, cursor, copilot, agents-md, all
  --cwd <path>         Working directory (defaults to process.cwd())
  --yes                Skip confirmation prompts
  --force              Overwrite existing files (add only)
  --registry <url>     Override registry URL (add / list)
  --local-only         Use only the bundled registry (add / list)

Examples:
  npx zot-agents add waitlist
  npx zot-agents list
  npx zot-agents remove waitlist

Related:
  Need to create a Zot resource (like a waitlist) from the terminal?
  Use the Zot API CLI instead:
    npx zot-cli waitlist create --name "Early Access" --write-env .env.local --public
`.trim();

async function main() {
  const rawArgs = process.argv.slice(2);
  const [subcommand, ...rest] = rawArgs;

  if (!subcommand || subcommand === "help" || subcommand === "--help" || subcommand === "-h") {
    console.log(HELP);
    return;
  }

  if (subcommand === "--version" || subcommand === "-v") {
    const pkg = await readSelfPackage();
    console.log(pkg.version ?? "unknown");
    return;
  }

  try {
    switch (subcommand) {
      case "add": {
        const { values, positionals } = parseSkillArgs(rest);
        const skill = positionals[0];
        if (!skill) {
          log.error("Missing skill name. Try: npx zot-agents add waitlist");
          process.exit(1);
        }
        await addCommand(skill, buildSkillContext(values));
        return;
      }
      case "remove":
      case "rm": {
        const { values, positionals } = parseSkillArgs(rest);
        const skill = positionals[0];
        if (!skill) {
          log.error("Missing skill name. Try: npx zot-agents remove waitlist");
          process.exit(1);
        }
        await removeCommand(skill, buildSkillContext(values));
        return;
      }
      case "list":
      case "ls": {
        const { values } = parseSkillArgs(rest);
        await listCommand(buildSkillContext(values));
        return;
      }
      case "create": {
        log.error(
          [
            "`zot-agents` does not create Zot resources.",
            "Use the dedicated Zot API CLI instead:",
            "",
            '  npx zot-cli waitlist create --name "Early Access" --write-env .env.local --public',
            "",
            "Run `npx zot-cli --help` for the full list of resource commands.",
          ].join("\n"),
        );
        process.exit(1);
        return;
      }
      default: {
        log.error(`Unknown command: ${subcommand}`);
        console.log();
        console.log(HELP);
        process.exit(1);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      log.error(err.message);
    } else {
      log.error(String(err));
    }
    process.exit(1);
  }
}

function parseSkillArgs(args: string[]) {
  return parseArgs({
    args,
    allowPositionals: true,
    strict: false,
    options: {
      target: { type: "string" },
      cwd: { type: "string" },
      yes: { type: "boolean", short: "y" },
      force: { type: "boolean" },
      registry: { type: "string" },
      "local-only": { type: "boolean" },
    },
  });
}

function buildSkillContext(values: Record<string, unknown>) {
  return {
    cwd: typeof values.cwd === "string" ? values.cwd : process.cwd(),
    targets: parseTargets(values.target),
    yes: values.yes === true,
    force: values.force === true,
    registry: typeof values.registry === "string" ? values.registry : undefined,
    localOnly: values["local-only"] === true,
  };
}

function parseTargets(value: unknown): string[] | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function readSelfPackage(): Promise<{ version?: string }> {
  try {
    const url = new URL("../package.json", import.meta.url);
    const fs = await import("node:fs/promises");
    const raw = await fs.readFile(url, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

void main();
