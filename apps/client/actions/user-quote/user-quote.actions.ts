"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export async function getUserQuote() {
  return await FetchWrapper("/user-quote");
}

export async function getUserQuoteHistory(params?: {
  service?: string;
  from?: string;
  to?: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.service) searchParams.set("service", params.service);
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return await FetchWrapper(`/user-quote/history${query ? `?${query}` : ""}`);
}
