"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type {
  RegisterWaitListUserValues,
  WaitListUserResponse,
  WaitListUserCountResponse,
} from "@repo/packages/shared/schemas";

export async function registerWaitListUser(
  waitlistId: string,
  data: RegisterWaitListUserValues
) {
  return await FetchWrapper<WaitListUserResponse>(`/wait-list/${waitlistId}/user`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getWaitListUsers(waitlistId: string) {
  return await FetchWrapper<WaitListUserResponse[]>(`/wait-list/${waitlistId}/user`);
}

export async function getWaitListUserCount(waitlistId: string) {
  return await FetchWrapper<WaitListUserCountResponse>(`/wait-list/${waitlistId}/user/count`);
}

export async function searchWaitListUser(waitlistId: string, email: string) {
  return await FetchWrapper<WaitListUserResponse>(
    `/wait-list/${waitlistId}/user/search?email=${encodeURIComponent(email)}`
  );
}

export async function deleteWaitListUser(waitlistId: string, email: string) {
  return await FetchWrapper(`/wait-list/${waitlistId}/user/${encodeURIComponent(email)}`, {
    method: "DELETE",
  });
}
