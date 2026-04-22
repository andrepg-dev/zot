#!/usr/bin/env node
import { chmod, cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const monorepoRoot = path.resolve(pkgRoot, "..", "..");

// 1) Copy the canonical SKILL.md from packages/skills/zot-waitlist
//    into this package's bundled skills folder, so the published tarball is
//    self-contained and does not depend on workspace siblings.
const src = path.join(monorepoRoot, "packages", "skills", "zot-waitlist", "SKILL.md");
const destDir = path.join(pkgRoot, "skills", "waitlist");
const dest = path.join(destDir, "SKILL.md");

await mkdir(destDir, { recursive: true });
await cp(src, dest);

// 2) Make the compiled bin executable.
const binFile = path.join(pkgRoot, "dist", "cli.js");
try {
  await chmod(binFile, 0o755);
} catch {
  // The bin may not exist yet during partial builds; ignore.
}

console.log(`✓ Bundled skill copied: ${path.relative(pkgRoot, dest)}`);
