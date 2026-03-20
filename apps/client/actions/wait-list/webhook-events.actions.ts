"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export interface WebhookEvent {
  _id: string;
  waitlistId: string;
  event: string;
  url: string;
  payload: Record<string, unknown>;
  status: "success" | "failed";
  responseStatusCode?: number;
  responseBody?: string;
  errorMessage?: string;
  sentAt?: string;
}

export async function getWebhookEvents(waitlistId: string) {
  return await FetchWrapper<WebhookEvent[]>(`/wait-list/${waitlistId}/webhook-events`);
}
