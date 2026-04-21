#!/usr/bin/env node
import { parseArgs } from "node:util";

import { addCommand } from "./commands/add.js";
import { createWaitlistCommand } from "./commands/create-waitlist.js";
import { listCommand } from "./commands/list.js";
import { removeCommand } from "./commands/remove.js";
import { log } from "./ui.js";

const HELP = `
zot-skills — install Zot agent skills and manage Zot resources

Usage:
  npx zot-skills <command> [options]

Commands:
  add <skill>          Install a skill (e.g. waitlist-best-practices)
  list                 List available skills
  remove <skill>       Remove an installed skill
  create waitlist      Create a new waitlist via the Zot API
  help                 Show this help

Options for \`add\` / \`remove\`:
  --target <list>      Comma-separated targets. Default: auto-detect.
                       Choices: claude, cursor, copilot, agents-md, all
  --cwd <path>         Working directory (defaults to process.cwd())
  --yes                Skip confirmation prompts
  --force              Overwrite existing files (add only)
  --registry <url>     Override registry URL (add / list)
  --local-only         Use only the bundled registry (add / list)

Options for \`create waitlist\`:
  --name <string>      Waitlist name (required)
  --api-key <key>      Override ZOT_API_KEY (falls back to env / .env.local / .env)
  --no-send-email      Disable "send email to new signup" (default: enabled)
  --write-env <file>   Append ZOT_WAITLIST_ID to this env file (e.g. .env.local)
  --public             With --write-env, also write NEXT_PUBLIC_ZOT_WAITLIST_ID
  --json               Print the raw API response as JSON
  --cwd <path>         Working directory

Examples:
  npx zot-skills add waitlist-best-practices
  npx zot-skills create waitlist --name "Early Access" --write-env .env.local --public
  npx zot-skills list
  npx zot-skills remove waitlist-best-practices
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
          log.error("Missing skill name. Try: npx zot-skills add waitlist-best-practices");
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
          log.error("Missing skill name. Try: npx zot-skills remove waitlist-best-practices");
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
        const [resource, ...createRest] = rest;
        if (!resource) {
          log.error('Missing resource. Try: npx zot-skills create waitlist --name "My list"');
          process.exit(1);
        }
        if (resource === "waitlist") {
          const { values } = parseArgs({
            args: createRest,
            allowPositionals: false,
            strict: false,
            options: {
              name: { type: "string" },
              "api-key": { type: "string" },
              "send-email": { type: "boolean" },
              "no-send-email": { type: "boolean" },
              "write-env": { type: "string" },
              public: { type: "boolean" },
              json: { type: "boolean" },
              cwd: { type: "string" },
            },
          });
          const sendEmail =
            values["no-send-email"] === true ? false : values["send-email"] !== false;
          await createWaitlistCommand({
            cwd: typeof values.cwd === "string" ? values.cwd : process.cwd(),
            name: typeof values.name === "string" ? values.name : undefined,
            apiKey:
              typeof values["api-key"] === "string" ? values["api-key"] : undefined,
            sendEmail,
            writeEnv:
              typeof values["write-env"] === "string" ? values["write-env"] : undefined,
            publicToo: values.public === true,
            json: values.json === true,
          });
          return;
        }
        log.error(`Unknown resource: ${resource}. Supported: waitlist`);
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
