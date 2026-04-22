import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { LoadedSkill, SkillManifest } from "./types.js";

const DEFAULT_REMOTE_REGISTRY =
  "https://raw.githubusercontent.com/ZotInc/zot/main/packages/agents-cli/skills/registry.json";

interface BundledRegistry {
  version: number;
  skills: Record<
    string,
    {
      version: string;
      description: string;
      file: string; // relative path inside the `skills/` folder
    }
  >;
}

interface RemoteRegistry {
  version: number;
  skills: Record<
    string,
    {
      version: string;
      description: string;
      url: string; // absolute URL to the SKILL.md content
    }
  >;
}

function bundledSkillsDir(): string {
  // This file lives at:
  //   package-root/dist/registry.js     (after build)
  //   package-root/src/registry.ts      (during dev via tsx etc.)
  // Either way the `skills/` folder is at package-root/skills.
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "skills");
}

async function readBundledRegistry(): Promise<BundledRegistry | undefined> {
  try {
    const file = path.join(bundledSkillsDir(), "registry.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as BundledRegistry;
  } catch {
    return undefined;
  }
}

async function fetchRemoteRegistry(url: string): Promise<RemoteRegistry | undefined> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return undefined;
    return (await response.json()) as RemoteRegistry;
  } catch {
    return undefined;
  }
}

export interface ListOptions {
  registryUrl?: string;
  localOnly: boolean;
}

export async function listAvailableSkills(opts: ListOptions): Promise<SkillManifest[]> {
  const bundled = (await readBundledRegistry()) ?? { version: 1, skills: {} };

  const bundledEntries: SkillManifest[] = Object.entries(bundled.skills).map(([name, meta]) => ({
    name,
    version: meta.version,
    description: meta.description,
    source: "bundled" as const,
  }));

  if (opts.localOnly) return bundledEntries;

  const remote = await fetchRemoteRegistry(opts.registryUrl ?? DEFAULT_REMOTE_REGISTRY);
  if (!remote) return bundledEntries;

  const merged = new Map<string, SkillManifest>();
  for (const entry of bundledEntries) merged.set(entry.name, entry);

  for (const [name, meta] of Object.entries(remote.skills)) {
    const existing = merged.get(name);
    if (!existing || versionGreater(meta.version, existing.version)) {
      merged.set(name, {
        name,
        version: meta.version,
        description: meta.description,
        source: "remote",
      });
    }
  }

  return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function loadSkill(
  name: string,
  opts: ListOptions,
): Promise<LoadedSkill | undefined> {
  const bundled = await readBundledRegistry();
  const remote = opts.localOnly
    ? undefined
    : await fetchRemoteRegistry(opts.registryUrl ?? DEFAULT_REMOTE_REGISTRY);

  const remoteEntry = remote?.skills[name];
  if (remoteEntry) {
    const bundledEntry = bundled?.skills[name];
    const preferRemote =
      !bundledEntry || versionGreater(remoteEntry.version, bundledEntry.version);
    if (preferRemote) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        const response = await fetch(remoteEntry.url, { signal: controller.signal });
        clearTimeout(timer);
        if (response.ok) {
          const content = await response.text();
          return {
            name,
            version: remoteEntry.version,
            description: remoteEntry.description,
            content,
            source: "remote",
          };
        }
      } catch {
        // fall through to bundled
      }
    }
  }

  const bundledEntry = bundled?.skills[name];
  if (!bundledEntry) return undefined;
  const file = path.join(bundledSkillsDir(), bundledEntry.file);
  const content = await fs.readFile(file, "utf8");
  return {
    name,
    version: bundledEntry.version,
    description: bundledEntry.description,
    content,
    source: "bundled",
  };
}

function versionGreater(a: string, b: string): boolean {
  const pa = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const av = pa[i] ?? 0;
    const bv = pb[i] ?? 0;
    if (av > bv) return true;
    if (av < bv) return false;
  }
  return false;
}
