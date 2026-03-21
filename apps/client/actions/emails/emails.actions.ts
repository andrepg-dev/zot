"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { EmailSendRecord, EmailSendRecordItem, SendEmailValues } from "@repo/packages/shared/schemas";

export async function sendEmail(data: SendEmailValues) {
  return await FetchWrapper("/emails", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getEmailSendRecords(waitlistId: string) {
  return await FetchWrapper<EmailSendRecord[]>(`/emails/${waitlistId}/records`);
}

export async function getEmailSendRecordsList(waitlistId: string) {
  return await FetchWrapper<EmailSendRecordItem[]>(`/emails/${waitlistId}/records/list`);
}
