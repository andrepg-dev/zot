"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type {
  CreateWaitListValues,
  UpdateWaitListValues,
  WaitListResponse
} from "@repo/packages/shared/schemas";

export async function createWaitList(data: CreateWaitListValues) {
  return await FetchWrapper<WaitListResponse>("/wait-list", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getWaitLists() {
  return await FetchWrapper<WaitListResponse[]>("/wait-list");
}

export async function getWaitListById(id: string) {
  return await FetchWrapper<WaitListResponse>(`/wait-list/${id}`);
}

export async function updateWaitList(id: string, data: UpdateWaitListValues) {
  const [result] = await Promise.all([
    FetchWrapper<WaitListResponse>(`/wait-list/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    }),
    new Promise((resolve) => setTimeout(resolve, 550))
  ]);
  return result;
}

export async function deleteWaitList(id: string) {
  return await FetchWrapper(`/wait-list/${id}`, { method: "DELETE" });
}
