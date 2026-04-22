import fs from "node:fs/promises";
import path from "node:path";

import type { AgentTarget } from "./types.js";

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect which agent configurations already exist in the project.
 * If none are detected, we fall back to installing into all of them so the
 * user gets immediate coverage.
 */
export async function detectTargets(cwd: string): Promise<AgentTarget[]> {
  const found: AgentTarget[] = [];

  if (await exists(path.join(cwd, ".claude"))) found.push("claude");
  if (await exists(path.join(cwd, ".cursor"))) found.push("cursor");
  if (await exists(path.join(cwd, ".github", "copilot-instructions.md"))) {
    found.push("copilot");
  }
  if (await exists(path.join(cwd, "AGENTS.md"))) found.push("agents-md");

  return found;
}
