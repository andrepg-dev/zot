import { Command } from "@oclif/core";

import { credentialsPath, deleteCredentials } from "../lib/credentials.js";
import { log } from "../lib/ui.js";

export default class Logout extends Command {
  static override description =
    "Remove locally stored Zot CLI credentials. Does not revoke the API key in your account.";

  public async run(): Promise<void> {
    const removed = await deleteCredentials();
    if (removed) {
      log.success(`Removed ${credentialsPath()}`);
      log.info(
        "The API key itself still exists in your Zot account. Revoke it from the dashboard if needed.",
      );
    } else {
      log.info(`No credentials found at ${credentialsPath()}.`);
    }
  }
}
