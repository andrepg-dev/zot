"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type {
  CreateEmailTemplateValues,
  UpdateEmailTemplateValues
} from "@repo/packages/shared/schemas";

export async function createEmailTemplate(data: CreateEmailTemplateValues) {
  return await FetchWrapper("/email-templates", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getEmailTemplates() {
  return await FetchWrapper("/email-templates");
}

export async function getPublicEmailTemplates() {
  return await FetchWrapper<Array<{ _id: string; alias: string; preview: string; subject: string }>>("/email-templates/public");
}

export async function getEmailTemplateById(id: string) {
  return await FetchWrapper(`/email-templates/${id}`);
}

export async function updateEmailTemplate(id: string, data: UpdateEmailTemplateValues) {
  return await FetchWrapper(`/email-templates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteEmailTemplate(id: string) {
  return await FetchWrapper(`/email-templates/${id}`, { method: "DELETE" });
}
