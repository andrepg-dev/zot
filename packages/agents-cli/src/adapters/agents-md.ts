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
 * AGENTS.md is an emerging convention most agents read by default.
 * We maintain one managed section per skill so multiple skills can coexist.
 */
export async function installAgentsMd(
  cwd: string,
  skill: LoadedSkill,
): Promise<InstallResult> {
  const file = path.join(cwd, "AGENTS.md");
  const existing = await readFileOr(file, "# AGENTS.md\n\nInstructions for AI coding agents.\n");
  const { body } = splitFrontmatter(skill.content);
  const { start, end } = marker("agents-md", skill.name);

  const block = [
    `## Skill: ${skill.name} (v${skill.version})`,
    "",
    skill.description,
    "",
    body.trim(),
  ].join("\n");

  const next = upsertSection(existing, start, end, block);
  const hadSection = existing.includes(start);
  await writeFile(file, next);
  return {
    target: "agents-md",
    path: file,
    action: hadSection ? "updated" : "created",
  };
}

export async function removeAgentsMd(cwd: string, skillName: string): Promise<InstallResult> {
  const file = path.join(cwd, "AGENTS.md");
  const existing = await readFileOr(file, "");
  const { start, end } = marker("agents-md", skillName);
  if (!existing.includes(start)) {
    return { target: "agents-md", path: file, action: "skipped" };
  }
  const next = removeSection(existing, start, end);
  await writeFile(file, next);
  return { target: "agents-md", path: file, action: "updated" };
}
