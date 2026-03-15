import type {
  ZotSDKOptions,
  CreateWaitListOptions,
  UpdateWaitListOptions,
  SaveUserOptions,
  FindWaitListOptions,
  FindWaitListUsersOptions,
  RemoveUserOptions,
  WaitList,
  WaitListUser,
  WaitListUserCount,
} from "./types";

const DEFAULT_BASE_URL = "http://localhost:3010";

export class ZotSDK {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: ZotSDKOptions) {
    if (!options.apiKey) {
      throw new Error("ZotSDK: apiKey is required");
    }
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  }

  // ── WaitList CRUD ──

  async createWaitList(options: CreateWaitListOptions): Promise<WaitList> {
    return this.request<WaitList>("POST", "/v1/wait-list", {
      name: options.name,
      sendEmailToNewSignup: options.emailSending ?? false,
      isSecurityActive: options.enableSecurity ?? false,
      webhook: options.webhook,
      widget_id: options.widgetId,
    });
  }

  async findWaitList(options: FindWaitListOptions = {}): Promise<WaitList | WaitList[]> {
    if (options.id) {
      return this.request<WaitList>("GET", `/v1/wait-list/${encodeURIComponent(options.id)}`);
    }
    return this.request<WaitList[]>("GET", "/v1/wait-list");
  }

  async updateWaitList(options: UpdateWaitListOptions): Promise<WaitList> {
    const { id, ...rest } = options;
    return this.request<WaitList>("PATCH", `/v1/wait-list/${encodeURIComponent(id)}`, {
      name: rest.name,
      sendEmailToNewSignup: rest.emailSending,
      isSecurityActive: rest.enableSecurity,
      isAvailable: rest.isAvailable,
      webhook: rest.webhook,
      widget_id: rest.widgetId,
    });
  }

  async deleteWaitList(id: string): Promise<void> {
    await this.request("DELETE", `/v1/wait-list/${encodeURIComponent(id)}`);
  }

  // ── WaitList Users ──

  async save(options: SaveUserOptions): Promise<WaitListUser> {
    return this.request<WaitListUser>(
      "POST",
      `/v1/wait-list/${encodeURIComponent(options.waitlistId)}/user`,
      {
        email: options.email,
        referredBy: options.referredBy,
      }
    );
  }

  async findWaitListUsers(options: FindWaitListUsersOptions): Promise<WaitListUser[]> {
    return this.request<WaitListUser[]>(
      "GET",
      `/v1/wait-list/${encodeURIComponent(options.waitlistId)}/user`
    );
  }

  async removeUser(options: RemoveUserOptions): Promise<void> {
    await this.request(
      "DELETE",
      `/v1/wait-list/${encodeURIComponent(options.waitlistId)}/user/${encodeURIComponent(options.email)}`
    );
  }

  async countUsers(waitlistId: string): Promise<WaitListUserCount> {
    return this.request<WaitListUserCount>(
      "GET",
      `/v1/wait-list/${encodeURIComponent(waitlistId)}/user/count`
    );
  }

  // ── Internal ──

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      "x-api-key": this.apiKey,
      "Accept": "application/json",
    };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ZotAPIError(res.status, res.statusText, text);
    }

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }
}

export class ZotAPIError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string
  ) {
    super(`Zot API error ${status}: ${statusText}`);
    this.name = "ZotAPIError";
  }
}
