"use server";

import { ZotSDK } from "zot-sdk";

export async function joinEarlyUsers(
  email: string,
  name?: string,
  metadata?: Record<string, unknown>
) {
  const apiKey = process.env.ZOT_API_KEY;
  const waitlistId = "69e65aadd2fdba5e8d8d8461";

  if (!apiKey) {
    throw new Error("Zot API KEY is not configured");
  }

  const zot = new ZotSDK({ apiKey });

  return await zot.waitlist(waitlistId).addUser({
    email,
    name,
    metadata
  });
}
