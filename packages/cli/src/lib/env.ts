import fs from "node:fs/promises";
import path from "node:path";

export function parseEnv(source: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) result[key] = value;
  }
  return result;
}

async function readFileSafe(file: string): Promise<string | undefined> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return undefined;
  }
}

/**
 * Look up an env var. Resolution order:
 *   1. `process.env`
 *   2. `<cwd>/.env.local`
 *   3. `<cwd>/.env`
 */
export async function resolveEnv(
  key: string,
  cwd: string,
): Promise<string | undefined> {
  if (process.env[key]) return process.env[key];

  for (const file of [".env.local", ".env"]) {
    const raw = await readFileSafe(path.join(cwd, file));
    if (!raw) continue;
    const parsed = parseEnv(raw);
    if (parsed[key]) return parsed[key];
  }

  return undefined;
}

/**
 * Upsert a set of key=value pairs into an env file. Preserves existing
 * content, only updates keys we pass in. Creates the file if missing.
 */
export async function upsertEnvFile(
  file: string,
  updates: Record<string, string>,
): Promise<"created" | "updated"> {
  const existing = (await readFileSafe(file)) ?? "";
  const lines = existing.split(/\r?\n/);
  const seen = new Set<string>();

  const nextLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return line;
    const key = trimmed.slice(0, eq).trim();
    if (updates[key] !== undefined) {
      seen.add(key);
      return `${key}=${updates[key]}`;
    }
    return line;
  });

  for (const [key, value] of Object.entries(updates)) {
    if (!seen.has(key)) nextLines.push(`${key}=${value}`);
  }

  let content = nextLines.join("\n");
  if (!content.endsWith("\n")) content += "\n";

  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf8");
  return existing ? "updated" : "created";
}
