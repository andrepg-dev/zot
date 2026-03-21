"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type {
  ApiKeyResponse,
  CreateApiKeyValues,
  UpdateApiKeyValues
} from "@repo/packages/shared/schemas";

export async function createApiKey(data: CreateApiKeyValues) {
  return await FetchWrapper<CreateApiKeyValues>("/api-key", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getApiKeys() {
  return await FetchWrapper<ApiKeyResponse[]>("/api-key");
}

export async function getApiKeyById(id: string) {
  return await FetchWrapper<ApiKeyResponse>(`/api-key/${id}`);
}

export async function updateApiKey(id: string, data: UpdateApiKeyValues) {
  return await FetchWrapper<UpdateApiKeyValues>(`/api-key/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteApiKey(id: string) {
  return await FetchWrapper(`/api-key/${id}`, { method: "DELETE" });
}
