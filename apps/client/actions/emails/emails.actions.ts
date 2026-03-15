"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { SendEmailValues } from "@repo/packages/shared/schemas";

export async function sendEmail(data: SendEmailValues) {
  return await FetchWrapper("/emails", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
