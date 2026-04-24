import { spawn } from "node:child_process";

export function canOpenBrowser(): boolean {
  if (process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY) {
    return false;
  }
  if (process.env.CI === "true" || process.env.CI === "1") return false;
  if (process.env.ZOT_NO_BROWSER === "1") return false;
  if (process.stdout.isTTY !== true) return false;
  return true;
}

export async function openBrowser(url: string): Promise<boolean> {
  const platform = process.platform;
  const [command, args] =
    platform === "darwin"
      ? ["open", [url]]
      : platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : ["xdg-open", [url]];
  try {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return true;
  } catch {
    return false;
  }
}
