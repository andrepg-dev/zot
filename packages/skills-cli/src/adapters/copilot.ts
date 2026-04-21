import path from "node:path";

import type { InstallResult, LoadedSkill } from "../types.js";
import {
  marker,
  readFileOr,
  removeSection,
  splitFrontmatter,
  upsertSection,
  writeFile,
} from "./shared.js";

/**
 * GitHub Copilot reads a single markdown file at
 * `.github/copilot-instructions.md`. We append the skill as a managed
 * section delimited by markers so repeated installs update in place.
 */
export async function installCopilot(
  cwd: string,
  skill: LoadedSkill,
): Promise<InstallResult> {
  const file = path.join(cwd, ".github", "copilot-instructions.md");
  const existing = await readFileOr(file, "# GitHub Copilot Instructions\n");
  const { body } = splitFrontmatter(skill.content);
  const { start, end } = marker("copilot", skill.name);

  const block = [
    `## ${skill.name} (v${skill.version})`,
    "",
    skill.description,
    "",
    body.trim(),
  ].join("\n");

  const next = upsertSection(existing, start, end, block);
  const hadSection = existing.includes(start);
  await writeFile(file, next);
  return {
    target: "copilot",
    path: file,
    action: hadSection ? "updated" : "created",
  };
}

export async function removeCopilot(cwd: string, skillName: string): Promise<InstallResult> {
  const file = path.join(cwd, ".github", "copilot-instructions.md");
  const existing = await readFileOr(file, "");
  const { start, end } = marker("copilot", skillName);
  if (!existing.includes(start)) {
    return { target: "copilot", path: file, action: "skipped" };
  }
  const next = removeSection(existing, start, end);
  await writeFile(file, next);
  return { target: "copilot", path: file, action: "updated" };
}
