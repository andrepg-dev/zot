"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { UserProfileResponse } from "@repo/packages/shared/schemas";

export async function getProfile() {
  return await FetchWrapper<UserProfileResponse>("/auth/profile");
}
