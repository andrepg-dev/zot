"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export interface DashboardStats {
  totalSignups: { value: number; change: number };
  activeWaitlists: { value: number; total: number; change: number };
  conversionRate: { value: number; change: number };
  avgWaitTime: { value: number; change: number };
  signupsBySource: Array<{ source: string; count: number; percentage: number }>;
  waitlistStatus: Array<{ status: string; count: number }>;
  recentSignups: Array<{
    _id: string;
    name?: string;
    email: string;
    waitlistName: string;
    position: number;
    source: string;
    status: string;
    createdAt: string;
  }>;
}

export async function getDashboardStats(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString();
  return await FetchWrapper<DashboardStats>(`/general-stats${query ? `?${query}` : ""}`);
}
