"use server";

import type {
  CreateGenerationEmailValues,
  GenerationChatMessage,
  GenerationEmail,
  GenerationEmailDetail,
  GenerationSkill,
  GenerationVariant,
  GenerationVersion
} from "@repo/packages/shared/schemas";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export async function createGenerationEmail(data: CreateGenerationEmailValues) {
  return await FetchWrapper<GenerationEmail>("/ai/generation/emails", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getGenerationEmails() {
  return await FetchWrapper<GenerationEmail[]>("/ai/generation/emails");
}

export async function getGenerationEmail(id: string) {
  return await FetchWrapper<GenerationEmailDetail>(`/ai/generation/emails/${id}`);
}

export async function getGenerationVersions(id: string) {
  return await FetchWrapper<GenerationVersion[]>(`/ai/generation/emails/${id}/versions`);
}

export async function getGenerationVersion(id: string, seq: number) {
  return await FetchWrapper<GenerationVariant>(`/ai/generation/emails/${id}/versions/${seq}`);
}

export async function getGenerationChat(id: string) {
  return await FetchWrapper<GenerationChatMessage[]>(`/ai/generation/emails/${id}/chat`);
}

export async function updateGenerationEmail(id: string, data: { title?: string }) {
  return await FetchWrapper<GenerationEmail>(`/ai/generation/emails/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteGenerationEmail(id: string) {
  return await FetchWrapper<{ deleted: boolean }>(`/ai/generation/emails/${id}`, {
    method: "DELETE"
  });
}

export async function getGenerationSkills() {
  return await FetchWrapper<GenerationSkill[]>("/ai/generation/skills");
}
