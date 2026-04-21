import path from "node:path";

import type { InstallResult, LoadedSkill } from "../types.js";
import { fileExists, removeFile, splitFrontmatter, tryRemoveEmptyDir, writeFile } from "./shared.js";

/**
 * Cursor uses `.cursor/rules/*.mdc` with its own frontmatter schema.
 * We translate the skill's frontmatter into a Cursor rule frontmatter and
 * keep the body intact.
 */
export async function installCursor(
  cwd: string,
  skill: LoadedSkill,
  force: boolean,
): Promise<InstallResult> {
  const file = path.join(cwd, ".cursor", "rules", `${skill.name}.mdc`);
  const existed = await fileExists(file);
  if (existed && !force) {
    return { target: "cursor", path: file, action: "skipped" };
  }

  const { body } = splitFrontmatter(skill.content);
  const frontmatter = [
    "---",
    `description: ${JSON.stringify(skill.description)}`,
    "globs: []",
    "alwaysApply: false",
    "---",
    "",
  ].join("\n");

  await writeFile(file, `${frontmatter}${body}`);
  return {
    target: "cursor",
    path: file,
    action: existed ? "overwritten" : "created",
  };
}

export async function removeCursor(cwd: string, skillName: string): Promise<InstallResult> {
  const file = path.join(cwd, ".cursor", "rules", `${skillName}.mdc`);
  const removed = await removeFile(file);
  await tryRemoveEmptyDir(path.join(cwd, ".cursor", "rules"));
  return {
    target: "cursor",
    path: file,
    action: removed ? "overwritten" : "skipped",
  };
}
