"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";
import type {
  ApproveCliSessionValues,
  CliSessionView,
  DenyCliSessionValues,
} from "@repo/packages/shared/schemas";

export async function getCliSessionByToken(sessionToken: string) {
  return await FetchWrapper<CliSessionView>(
    `/auth/cli/session/by-token/${encodeURIComponent(sessionToken)}`,
  );
}

export async function getCliSessionByCode(userCode: string) {
  return await FetchWrapper<CliSessionView>(
    `/auth/cli/session/by-code/${encodeURIComponent(userCode)}`,
  );
}

export async function approveCliSession(values: ApproveCliSessionValues) {
  return await FetchWrapper<{ status: "approved"; clientName?: string; apiKeyName: string }>(
    "/auth/cli/approve",
    { method: "POST", body: JSON.stringify(values) },
  );
}

export async function denyCliSession(values: DenyCliSessionValues) {
  return await FetchWrapper<{ status: "denied" }>("/auth/cli/deny", {
    method: "POST",
    body: JSON.stringify(values),
  });
}
