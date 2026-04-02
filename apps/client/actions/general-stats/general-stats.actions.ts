"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export interface DayCount {
  date: string;
  count: number;
}

export interface GeneralStats {
  signupsByDay: DayCount[];
  emailsByDay: DayCount[];
  blockedByDay: DayCount[];
  webhooksByDay: DayCount[];
}

export async function getGeneralStats() {
  return await FetchWrapper<GeneralStats>("/general-stats");
}
