"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export async function updateUser(data: { name?: string; lastName?: string }) {
  return await FetchWrapper("/users", {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteAccount() {
  return await FetchWrapper("/users", { method: "DELETE" });
}

export async function completeOnboarding() {
  return await FetchWrapper("/users/me/onboarding", { method: "PATCH" });
}
