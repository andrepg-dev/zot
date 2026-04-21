import path from "node:path";

import type { WaitlistResponse } from "zot-sdk";

import { resolveEnv, upsertEnvFile } from "../env.js";
import { c, log } from "../ui.js";

export interface CreateWaitlistOptions {
  cwd: string;
  name: string | undefined;
  apiKey: string | undefined;
  sendEmail: boolean;
  writeEnv: string | undefined;
  publicToo: boolean;
  json: boolean;
}

export async function createWaitlistCommand(
  opts: CreateWaitlistOptions,
): Promise<void> {
  if (!opts.name) {
    throw new Error(
      'Missing --name. Example: npx zot-skills create waitlist --name "Early Access"',
    );
  }

  const apiKey =
    opts.apiKey ?? (await resolveEnv("ZOT_API_KEY", opts.cwd));

  if (!apiKey) {
    throw new Error(
      [
        "No API key found.",
        "Provide one via:",
        "  --api-key <key>",
        "  ZOT_API_KEY environment variable",
        "  a .env.local or .env file at the project root",
        "",
        "Get your key at https://zot.so → Settings → API Keys.",
      ].join("\n"),
    );
  }

  const { ZotSDK, ZotAPIError } = await loadSdk();
  const zot = new ZotSDK({ apiKey });

  let waitlist: WaitlistResponse;
  try {
    waitlist = await zot.waitlists.create({
      name: opts.name,
      sendEmailToNewSignup: opts.sendEmail,
    });
  } catch (err) {
    if (err instanceof ZotAPIError) {
      throw new Error(
        `Zot API error ${err.statusCode}: ${JSON.stringify(err.body)}`,
      );
    }
    throw err;
  }

  if (opts.json) {
    console.log(JSON.stringify(waitlist, null, 2));
    return;
  }

  log.title("Waitlist created");
  log.step(`${c.bold("ID")}          ${waitlist._id}`);
  log.step(`${c.bold("Name")}        ${waitlist.name}`);
  log.step(
    `${c.bold("Send email")}  ${waitlist.sendEmailToNewSignup ? "yes" : "no"}`,
  );
  log.step(`${c.bold("Available")}   ${waitlist.isAvailable ? "yes" : "no"}`);
  log.step(`${c.bold("Created at")}  ${waitlist.createdAt}`);

  if (opts.writeEnv) {
    const file = path.resolve(opts.cwd, opts.writeEnv);
    const updates: Record<string, string> = {
      ZOT_WAITLIST_ID: waitlist._id,
    };
    if (opts.publicToo) {
      updates.NEXT_PUBLIC_ZOT_WAITLIST_ID = waitlist._id;
    }
    const action = await upsertEnvFile(file, updates);
    log.title(`.env ${action}`);
    log.step(`${path.relative(opts.cwd, file) || file}`);
    for (const [k, v] of Object.entries(updates)) {
      log.step(`${c.green("+")} ${k}=${v}`);
    }
  } else {
    log.title("Add to your .env");
    console.log(`  ZOT_WAITLIST_ID=${waitlist._id}`);
    if (opts.publicToo) {
      console.log(`  NEXT_PUBLIC_ZOT_WAITLIST_ID=${waitlist._id}`);
    } else {
      log.info(
        "For client-side Next.js code, also set NEXT_PUBLIC_ZOT_WAITLIST_ID (use --public too to include it automatically).",
      );
    }
  }

  log.success(`Done. Register users with zot.waitlist("${waitlist._id}").addUser(...)`);
}

/**
 * Load `zot-sdk` lazily so CLI commands that don't need it (like `list`)
 * don't pay the import cost and still work if the dep is missing.
 */
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
        "Could not load `zot-sdk`. It should ship with zot-skills, but was not found.",
        "Install manually: npm install zot-sdk",
        "",
        `Original error: ${err instanceof Error ? err.message : String(err)}`,
      ].join("\n"),
    );
  }
}
