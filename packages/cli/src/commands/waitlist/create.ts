import path from "node:path";

import { Command, Flags } from "@oclif/core";
import type { WaitlistResponse } from "zot-sdk";

import { resolveEnv, upsertEnvFile } from "../../lib/env.js";
import { c, log } from "../../lib/ui.js";

export default class WaitlistCreate extends Command {
  static override description =
    "Create a Zot waitlist via the API and optionally persist its ID into a .env file.";

  static override examples = [
    '<%= config.bin %> waitlist create --name "Early Access" --write-env .env.local --public',
    '<%= config.bin %> waitlist create --name "Beta" --write-env .env',
    '<%= config.bin %> waitlist create --name "Scripted" --api-key $ZOT_API_KEY --json',
    '<%= config.bin %> waitlist create --name "Quiet list" --no-send-email',
  ];

  static override enableJsonFlag = true;

  static override flags = {
    name: Flags.string({
      description: "Waitlist name.",
      required: true,
    }),
    "api-key": Flags.string({
      description:
        "Override ZOT_API_KEY. Falls back to env var, then .env.local, then .env.",
    }),
    "send-email": Flags.boolean({
      description: "Send a welcome email to each new signup.",
      default: true,
      allowNo: true,
    }),
    "write-env": Flags.string({
      description:
        "Upsert ZOT_WAITLIST_ID into this env file (e.g. .env.local, .env).",
    }),
    public: Flags.boolean({
      description:
        "When combined with --write-env, also write NEXT_PUBLIC_ZOT_WAITLIST_ID.",
      dependsOn: ["write-env"],
    }),
    cwd: Flags.string({
      description:
        "Working directory used for env resolution and --write-env.",
    }),
  };

  public async run(): Promise<WaitlistResponse> {
    const { flags } = await this.parse(WaitlistCreate);
    const cwd = flags.cwd ?? process.cwd();

    const apiKey = flags["api-key"] ?? (await resolveEnv("ZOT_API_KEY", cwd));
    if (!apiKey) {
      this.error(
        [
          "No API key found.",
          "Provide one via:",
          "  --api-key <key>",
          "  ZOT_API_KEY environment variable",
          "  a .env.local or .env file in the working directory",
          "",
          "Get your key at https://app.zot.so/app/api-keys",
        ].join("\n"),
        { exit: 1 },
      );
    }

    const { ZotSDK, ZotAPIError } = await loadSdk();
    const zot = new ZotSDK({ apiKey });

    let waitlist: WaitlistResponse;
    try {
      waitlist = await zot.waitlists.create({
        name: flags.name,
        sendEmailToNewSignup: flags["send-email"],
      });
    } catch (err) {
      if (err instanceof ZotAPIError) {
        this.error(
          `Zot API error ${err.statusCode}: ${JSON.stringify(err.body)}`,
          { exit: 1 },
        );
      }
      throw err;
    }

    if (!this.jsonEnabled()) {
      log.title("Waitlist created");
      log.step(`${c.bold("ID")}          ${waitlist._id}`);
      log.step(`${c.bold("Name")}        ${waitlist.name}`);
      log.step(
        `${c.bold("Send email")}  ${waitlist.sendEmailToNewSignup ? "yes" : "no"}`,
      );
      log.step(`${c.bold("Available")}   ${waitlist.isAvailable ? "yes" : "no"}`);
      log.step(`${c.bold("Created at")}  ${waitlist.createdAt}`);
    }

    if (flags["write-env"]) {
      const file = path.resolve(cwd, flags["write-env"]);
      const updates: Record<string, string> = {
        ZOT_WAITLIST_ID: waitlist._id,
      };
      if (flags.public) {
        updates.NEXT_PUBLIC_ZOT_WAITLIST_ID = waitlist._id;
      }
      const action = await upsertEnvFile(file, updates);
      if (!this.jsonEnabled()) {
        log.title(`.env ${action}`);
        log.step(`${path.relative(cwd, file) || file}`);
        for (const [k, v] of Object.entries(updates)) {
          log.step(`${c.green("+")} ${k}=${v}`);
        }
      }
    } else if (!this.jsonEnabled()) {
      log.title("Add to your .env");
      this.log(`  ZOT_WAITLIST_ID=${waitlist._id}`);
      log.info(
        "For Next.js client-side code, also set NEXT_PUBLIC_ZOT_WAITLIST_ID (pass --write-env with --public to do it automatically).",
      );
    }

    if (!this.jsonEnabled()) {
      log.success(
        `Done. Register users with zot.waitlist("${waitlist._id}").addUser(...)`,
      );
    }

    return waitlist;
  }
}

async function loadSdk(): Promise<{
  ZotSDK: typeof import("zot-sdk").ZotSDK;
  ZotAPIError: typeof import("zot-sdk").ZotAPIError;
}> {
  try {
    const mod = await import("zot-sdk");
    return { ZotSDK: mod.ZotSDK, ZotAPIError: mod.ZotAPIError };
  } catch (err) {
    throw new Error(
      [
        "Could not load `zot-sdk`. It should ship with zot-cli, but was not found.",
        "Install manually: npm install zot-sdk",
        "",
        `Original error: ${err instanceof Error ? err.message : String(err)}`,
      ].join("\n"),
    );
  }
}
