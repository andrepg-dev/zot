"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export interface GeneralStats {
  signupsByDay: {
    date: string;
    count: number;
  }[];
}

export async function getGeneralStats() {
  return await FetchWrapper<GeneralStats>("/general-stats");
}
