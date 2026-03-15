"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { LogoutResponse } from "@repo/packages/shared/schemas";

export async function logout() {
  return await FetchWrapper<LogoutResponse>("/auth/logout");
}
