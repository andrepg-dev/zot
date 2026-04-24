import { Command } from "@oclif/core";

import { credentialsPath, readCredentials } from "../lib/credentials.js";
import { c, log } from "../lib/ui.js";

export default class Whoami extends Command {
  static override description = "Show which credentials the CLI will use.";
  static override enableJsonFlag = true;

  public async run(): Promise<{ loggedIn: boolean; apiUrl?: string; createdAt?: string }> {
    const creds = await readCredentials();
    if (!creds) {
      if (!this.jsonEnabled()) {
        log.info("Not logged in.");
        this.log(`  ${c.dim("run")} zot-cli login`);
      }
      return { loggedIn: false };
    }

    const masked = maskKey(creds.apiKey);

    if (!this.jsonEnabled()) {
      log.title("Logged in");
      log.step(`${c.bold("Key")}        ${masked}`);
      if (creds.apiUrl) log.step(`${c.bold("API URL")}    ${creds.apiUrl}`);
      if (creds.createdAt) log.step(`${c.bold("Saved")}      ${creds.createdAt}`);
      log.step(`${c.bold("File")}       ${credentialsPath()}`);
    }
    return { loggedIn: true, apiUrl: creds.apiUrl, createdAt: creds.createdAt };
  }
}

function maskKey(key: string): string {
  if (key.length <= 10) return "****";
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}
