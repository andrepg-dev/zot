import { resolveApiUrl } from "./api-url.js";

export interface DeviceFlowStart {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  expiresIn: number;
  interval: number;
}

export type PollStatus =
  | "authorization_pending"
  | "slow_down"
  | "approved"
  | "access_denied"
  | "expired_token";

export interface PollResponse {
  status: PollStatus;
  apiKey?: string;
  interval?: number;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${resolveApiUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(`Zot API responded ${res.status}: ${detail || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function startDeviceFlow(clientName: string): Promise<DeviceFlowStart> {
  return postJson<DeviceFlowStart>("/auth/cli/start", { clientName });
}

export async function pollDeviceFlow(deviceCode: string): Promise<PollResponse> {
  return postJson<PollResponse>("/auth/cli/poll", { deviceCode });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
