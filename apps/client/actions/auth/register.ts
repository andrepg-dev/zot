"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { CreateUserValues } from "@repo/packages/shared/schemas";

export async function register(data: CreateUserValues) {
  return await FetchWrapper("/auth/register", { method: "POST", body: JSON.stringify(data) }, true);
}
