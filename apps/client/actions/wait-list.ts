"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export async function getWaitList() {
  return await FetchWrapper("/wait-list");
}
