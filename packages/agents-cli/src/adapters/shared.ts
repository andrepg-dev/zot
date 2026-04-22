import fs from "node:fs/promises";
import path from "node:path";

import type { LoadedSkill } from "../types.js";

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function readFileOr(file: string, fallback: string): Promise<string> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return fallback;
  }
}

export async function writeFile(file: string, content: string): Promise<void> {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, content, "utf8");
}

export async function removeFile(file: string): Promise<boolean> {
  try {
    await fs.unlink(file);
    return true;
  } catch {
    return false;
  }
}

export async function tryRemoveEmptyDir(dir: string): Promise<void> {
  try {
    const entries = await fs.readdir(dir);
    if (entries.length === 0) await fs.rmdir(dir);
  } catch {
    // ignore
  }
}

/** Markers so we can safely update/remove a section we previously wrote. */
export function marker(name: string, skill: string) {
  return {
    start: `<!-- zot-agents:${name}:${skill}:start -->`,
    end: `<!-- zot-agents:${name}:${skill}:end -->`,
  };
}

export function upsertSection(
  existing: string,
  startMarker: string,
  endMarker: string,
  block: string,
): string {
  const startIdx = existing.indexOf(startMarker);
  const endIdx = existing.indexOf(endMarker);
  const newBlock = `${startMarker}\n${block}\n${endMarker}`;

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return `${existing.slice(0, startIdx)}${newBlock}${existing.slice(endIdx + endMarker.length)}`;
  }

  const trimmed = existing.replace(/\s+$/, "");
  return `${trimmed}${trimmed.length > 0 ? "\n\n" : ""}${newBlock}\n`;
}

export function removeSection(
  existing: string,
  startMarker: string,
  endMarker: string,
): string {
  const startIdx = existing.indexOf(startMarker);
  const endIdx = existing.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return existing;
  const before = existing.slice(0, startIdx).replace(/\s+$/, "");
  const after = existing.slice(endIdx + endMarker.length).replace(/^\s+/, "");
  if (!before) return after;
  if (!after) return `${before}\n`;
  return `${before}\n\n${after}`;
}

/** Strip YAML frontmatter from a SKILL.md body, returning `{ frontmatter, body }`. */
export function splitFrontmatter(source: string): {
  frontmatter: string | undefined;
  body: string;
} {
  if (!source.startsWith("---")) return { frontmatter: undefined, body: source };
  const end = source.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: undefined, body: source };
  const frontmatter = source.slice(3, end).trim();
  const body = source.slice(end + 4).replace(/^\n+/, "");
  return { frontmatter, body };
}

export function skillSummary(skill: LoadedSkill): string {
  return `${skill.name} v${skill.version} — ${skill.description}`;
}
