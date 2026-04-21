import path from "node:path";

import type { InstallResult, LoadedSkill } from "../types.js";
import { fileExists, removeFile, tryRemoveEmptyDir, writeFile } from "./shared.js";

/**
 * Claude Code stores skills as `.claude/skills/<name>/SKILL.md`.
 * We write the SKILL.md verbatim (frontmatter included) so Claude's skill
 * loader picks it up.
 */
export async function installClaude(
  cwd: string,
  skill: LoadedSkill,
  force: boolean,
): Promise<InstallResult> {
  const file = path.join(cwd, ".claude", "skills", skill.name, "SKILL.md");
  const existed = await fileExists(file);
  if (existed && !force) {
    return { target: "claude", path: file, action: "skipped" };
  }
  await writeFile(file, skill.content);
  return {
    target: "claude",
    path: file,
    action: existed ? "overwritten" : "created",
  };
}

export async function removeClaude(cwd: string, skillName: string): Promise<InstallResult> {
  const file = path.join(cwd, ".claude", "skills", skillName, "SKILL.md");
  const removed = await removeFile(file);
  await tryRemoveEmptyDir(path.dirname(file));
  await tryRemoveEmptyDir(path.join(cwd, ".claude", "skills"));
  return {
    target: "claude",
    path: file,
    action: removed ? "overwritten" : "skipped",
  };
}
