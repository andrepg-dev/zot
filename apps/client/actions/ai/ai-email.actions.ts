"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type { UpdateAiConversationValues } from "@repo/packages/shared/schemas";

export interface AiMessage {
  _id: string;
  role: "user" | "assistant";
  message?: string;
  code?: string | null;
  response?: string | null;
  operation_type?: "code" | "text" | "normal";
  created_at: string;
}

export interface AiConversation {
  _id: string;
  title: string;
  messages: AiMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AiEmailResponse {
  response: string | null;
  code: string | null;
  operation_type: "code" | "text" | "normal";
  conversationId: string;
}

export async function sendMessageToAi(message: string, conversationId?: string | null) {
  return await FetchWrapper<AiEmailResponse>("/ai/react-code-email", {
    method: "POST",
    body: JSON.stringify({ message, conversationId })
  });
}

export async function getAiConversation(conversationId: string) {
  return await FetchWrapper<AiConversation>(`/ai/react-code-email/${conversationId}`);
}

export async function getAiConversations() {
  return await FetchWrapper<AiConversation[]>("/ai/react-code-email/conversations");
}

export async function editAiConversation(conversationId: string, data: UpdateAiConversationValues) {
  return await FetchWrapper<AiConversation>(`/ai/react-code-email/${conversationId}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteAiConversation(conversationId: string) {
  return await FetchWrapper<string>(`/ai/react-code-email/${conversationId}`, {
    method: "DELETE"
  });
}
