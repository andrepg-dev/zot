"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export async function getWaitListStats(waitlistId: string) {
  return await FetchWrapper(`/wait-list/${waitlistId}/stats`);
}
