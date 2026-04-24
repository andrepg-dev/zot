import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export interface StoredCredentials {
  apiKey: string;
  apiUrl?: string;
  createdAt: string;
}

export function credentialsPath(): string {
  const xdg = process.env.XDG_CONFIG_HOME;
  const base = xdg && xdg.length > 0 ? xdg : path.join(os.homedir(), ".config");
  return path.join(base, "zot", "credentials.json");
}

export async function readCredentials(): Promise<StoredCredentials | undefined> {
  const file = credentialsPath();
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as StoredCredentials).apiKey === "string"
    ) {
      return parsed as StoredCredentials;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export async function writeCredentials(creds: StoredCredentials): Promise<string> {
  const file = credentialsPath();
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const payload = JSON.stringify(creds, null, 2);
  await fs.writeFile(file, payload, { encoding: "utf8", mode: 0o600 });
  try {
    await fs.chmod(file, 0o600);
  } catch {
    /* non-POSIX filesystem, ignore */
  }
  return file;
}

export async function deleteCredentials(): Promise<boolean> {
  const file = credentialsPath();
  try {
    await fs.unlink(file);
    return true;
  } catch {
    return false;
  }
}
