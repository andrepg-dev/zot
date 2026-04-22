import path from "node:path";

import { installAgentsMd } from "../adapters/agents-md.js";
import { installClaude } from "../adapters/claude.js";
import { installCopilot } from "../adapters/copilot.js";
import { installCursor } from "../adapters/cursor.js";
import { detectTargets } from "../detect.js";
import { loadSkill } from "../registry.js";
import type { AgentTarget, CommandContext, InstallResult } from "../types.js";
import { ALL_TARGETS } from "../types.js";
import { c, confirm, log } from "../ui.js";

export async function addCommand(skillName: string, ctx: CommandContext): Promise<void> {
  log.title(`Installing ${c.bold(skillName)}`);

  const skill = await loadSkill(skillName, {
    registryUrl: ctx.registry,
    localOnly: ctx.localOnly,
  });

  if (!skill) {
    log.error(`Unknown skill: ${skillName}`);
    log.info("Run `npx @zot-core/agents list` to see available skills.");
    process.exit(1);
  }

  log.step(`source: ${skill.source === "remote" ? "remote registry" : "bundled"} (v${skill.version})`);
  log.step(skill.description);

  const targets = await resolveTargets(ctx);
  log.step(`targets: ${targets.join(", ")}`);

  if (!ctx.yes) {
    const cwdLabel = path.resolve(ctx.cwd);
    const ok = await confirm(`Install into ${cwdLabel}?`, true);
    if (!ok) {
      log.warn("Aborted.");
      return;
    }
  }

  const results: InstallResult[] = [];

  for (const target of targets) {
    try {
      const result = await runInstall(target, ctx, skill);
      results.push(result);
    } catch (err) {
      log.error(
        `Failed to install into ${target}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }

  log.title("Summary");
  for (const r of results) {
    const label =
      r.action === "created"
        ? c.green("created    ")
        : r.action === "overwritten"
          ? c.yellow("overwritten")
          : r.action === "updated"
            ? c.yellow("updated    ")
            : c.dim("skipped    ");
    log.step(`${label} ${path.relative(ctx.cwd, r.path) || r.path}`);
  }

  const skippedByExisting = results.filter((r) => r.action === "skipped");
  if (skippedByExisting.length > 0 && !ctx.force) {
    log.info("Some files were skipped because they already exist. Re-run with --force to overwrite.");
  }

  log.success(`Done. Ask your agent: "follow the ${skillName} skill"`);
}

async function resolveTargets(ctx: CommandContext): Promise<AgentTarget[]> {
  const requested = ctx.targets;

  if (requested && requested.length > 0) {
    if (requested.includes("all")) return [...ALL_TARGETS];
    const valid = requested.filter(isAgentTarget);
    const invalid = requested.filter((t) => !isAgentTarget(t) && t !== "all");
    if (invalid.length > 0) {
      log.warn(`Ignoring unknown targets: ${invalid.join(", ")}`);
    }
    if (valid.length === 0) {
      throw new Error(
        `No valid targets. Valid options: ${ALL_TARGETS.join(", ")} or "all".`,
      );
    }
    return valid;
  }

  const detected = await detectTargets(ctx.cwd);
  if (detected.length > 0) return detected;

  log.info("No agent configuration detected. Installing into all supported targets.");
  return [...ALL_TARGETS];
}

function isAgentTarget(value: string): value is AgentTarget {
  return (ALL_TARGETS as string[]).includes(value);
}

async function runInstall(
  target: AgentTarget,
  ctx: CommandContext,
  skill: Parameters<typeof installClaude>[1],
): Promise<InstallResult> {
  switch (target) {
    case "claude":
      return installClaude(ctx.cwd, skill, ctx.force);
    case "cursor":
      return installCursor(ctx.cwd, skill, ctx.force);
    case "copilot":
      return installCopilot(ctx.cwd, skill);
    case "agents-md":
      return installAgentsMd(ctx.cwd, skill);
  }
}
