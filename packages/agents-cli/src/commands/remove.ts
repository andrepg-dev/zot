import path from "node:path";

import { removeAgentsMd } from "../adapters/agents-md.js";
import { removeClaude } from "../adapters/claude.js";
import { removeCopilot } from "../adapters/copilot.js";
import { removeCursor } from "../adapters/cursor.js";
import type { AgentTarget, CommandContext, InstallResult } from "../types.js";
import { ALL_TARGETS } from "../types.js";
import { c, confirm, log } from "../ui.js";

export async function removeCommand(skillName: string, ctx: CommandContext): Promise<void> {
  log.title(`Removing ${c.bold(skillName)}`);

  const targets: AgentTarget[] =
    ctx.targets && ctx.targets.length > 0
      ? (ctx.targets.includes("all")
          ? [...ALL_TARGETS]
          : (ctx.targets.filter((t): t is AgentTarget =>
              (ALL_TARGETS as string[]).includes(t),
            )))
      : [...ALL_TARGETS];

  if (targets.length === 0) {
    throw new Error(`No valid targets. Valid options: ${ALL_TARGETS.join(", ")} or "all".`);
  }

  if (!ctx.yes) {
    const ok = await confirm(`Remove ${skillName} from ${path.resolve(ctx.cwd)}?`, true);
    if (!ok) {
      log.warn("Aborted.");
      return;
    }
  }

  const results: InstallResult[] = [];
  for (const target of targets) {
    const result = await runRemove(target, ctx.cwd, skillName);
    results.push(result);
  }

  log.title("Summary");
  for (const r of results) {
    const label =
      r.action === "skipped"
        ? c.dim("not found ")
        : c.green("removed   ");
    log.step(`${label} ${path.relative(ctx.cwd, r.path) || r.path}`);
  }
}

async function runRemove(
  target: AgentTarget,
  cwd: string,
  skillName: string,
): Promise<InstallResult> {
  switch (target) {
    case "claude":
      return removeClaude(cwd, skillName);
    case "cursor":
      return removeCursor(cwd, skillName);
    case "copilot":
      return removeCopilot(cwd, skillName);
    case "agents-md":
      return removeAgentsMd(cwd, skillName);
  }
}
