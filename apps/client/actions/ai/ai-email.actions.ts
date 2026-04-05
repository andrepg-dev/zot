"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

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

export async function sendMessageToAi(message: string, conversationId?: string) {
  return await FetchWrapper<AiEmailResponse>("/ai/react-code-email", {
    method: "POST",
    body: JSON.stringify({ message, conversationId })
  });
}

export async function getAiConversation(conversationId: string) {
  return await FetchWrapper<AiConversation>(`/ai/react-code-email/${conversationId}`);
}
