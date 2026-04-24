import { Command, Flags } from "@oclif/core";

import { canOpenBrowser, openBrowser } from "../lib/browser.js";
import { credentialsPath, writeCredentials } from "../lib/credentials.js";
import {
  pollDeviceFlow,
  sleep,
  startDeviceFlow,
  type PollStatus,
} from "../lib/device-flow.js";
import { resolveApiUrl } from "../lib/api-url.js";
import { c, log } from "../lib/ui.js";

export default class Login extends Command {
  static override description =
    "Log in to Zot by authorizing this machine in your browser. Stores credentials at ~/.config/zot/credentials.json.";

  static override examples = [
    "<%= config.bin %> login",
    "<%= config.bin %> login --client-name \"my laptop\"",
  ];

  static override flags = {
    "client-name": Flags.string({
      description: "Optional label shown in the approval page.",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Login);

    const pkgVersion = this.config.version ?? "unknown";
    const defaultClientName = `zot-cli ${pkgVersion}`;
    const clientName = flags["client-name"] ?? defaultClientName;

    log.title("Authorizing Zot CLI");
    log.step(`API: ${resolveApiUrl()}`);

    const start = await startDeviceFlow(clientName);

    const openable = canOpenBrowser();
    let opened = false;
    if (openable) {
      opened = await openBrowser(start.verificationUriComplete);
    }

    if (opened) {
      log.info("Opened your browser. Complete the approval there.");
      log.step(`If the browser didn't open, visit:`);
      log.step(c.cyan(start.verificationUriComplete));
    } else {
      log.info("To finish logging in, visit this URL in your browser:");
      log.step(c.cyan(start.verificationUriComplete));
    }
    log.step(`Or manually enter code ${c.bold(start.userCode)} at ${start.verificationUri}`);

    const apiKey = await this.pollUntilResolved(start.deviceCode, start.interval, start.expiresIn);

    const file = await writeCredentials({
      apiKey,
      apiUrl: resolveApiUrl(),
      createdAt: new Date().toISOString(),
    });

    log.success("You're logged in.");
    log.step(`Credentials saved to ${credentialsPath()}`);
    this.log(`  ${c.dim("file")} ${file}`);
    log.info("Other commands (e.g. `zot-cli waitlist create`) will now use this key automatically.");
  }

  private async pollUntilResolved(
    deviceCode: string,
    initialInterval: number,
    expiresIn: number,
  ): Promise<string> {
    const deadline = Date.now() + expiresIn * 1000;
    let interval = Math.max(initialInterval, 1);

    log.info("Waiting for approval in your browser...");

    while (Date.now() < deadline) {
      await sleep(interval * 1000);
      const result = await pollDeviceFlow(deviceCode);
      switch (result.status as PollStatus) {
        case "approved":
          if (!result.apiKey) {
            throw new Error("Server approved the session but did not return an API key.");
          }
          return result.apiKey;
        case "authorization_pending":
          if (result.interval) interval = Math.max(result.interval, 1);
          continue;
        case "slow_down":
          interval = interval + 2;
          continue;
        case "access_denied":
          throw new Error("Access denied. You (or the approver) rejected the CLI login.");
        case "expired_token":
          throw new Error("Session expired before approval. Run `zot-cli login` again.");
        default:
          throw new Error(`Unexpected poll status: ${String(result.status)}`);
      }
    }
    throw new Error("Timed out waiting for approval. Run `zot-cli login` again.");
  }
}
