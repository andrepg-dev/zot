import { chmod } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

for (const rel of ["bin/run.js", "bin/dev.js"]) {
  const file = path.join(root, rel);
  try {
    await chmod(file, 0o755);
  } catch (err) {
    console.warn(`! could not chmod ${rel}: ${err instanceof Error ? err.message : err}`);
  }
}
