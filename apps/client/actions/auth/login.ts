"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { LoginFormValues } from "@repo/packages/shared/schemas";

export async function login(data: LoginFormValues) {
  return await FetchWrapper("/auth/login", { method: "POST", body: JSON.stringify(data) }, true);
}
