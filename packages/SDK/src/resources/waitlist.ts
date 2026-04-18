import { HttpClient } from "../http";
import type {
  AddUserParams,
  CreateWaitlistParams,
  UpdateUserStatusParams,
  UpdateWaitlistParams,
  UserCountResponse,
  WaitlistResponse,
  WaitlistUserResponse,
} from "../types";

export class WaitlistResource {
  constructor(
    private readonly http: HttpClient,
    private readonly waitlistId: string,
  ) {}

  /** Get this waitlist's details. */
  async get(): Promise<WaitlistResponse> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}`,
    });
  }

  /** Update this waitlist. */
  async update(params: UpdateWaitlistParams): Promise<WaitlistResponse> {
    return this.http.request({
      method: "PATCH",
      path: `/v1/wait-list/${this.waitlistId}`,
      body: params,
    });
  }

  /** Delete this waitlist permanently. */
  async delete(): Promise<void> {
    return this.http.request({
      method: "DELETE",
      path: `/v1/wait-list/${this.waitlistId}`,
    });
  }

  /** Get aggregated stats for this waitlist. */
  async stats(): Promise<Record<string, unknown>> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}/stats`,
    });
  }

  /** Get webhook delivery events for this waitlist. */
  async webhookEvents(): Promise<unknown[]> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}/webhook-events`,
    });
  }

  // ─── Users ───

  /** Register a new user to this waitlist. */
  async addUser(params: AddUserParams): Promise<WaitlistUserResponse> {
    return this.http.request({
      method: "POST",
      path: `/v1/wait-list/${this.waitlistId}/user`,
      body: params,
    });
  }

  /** List all users in this waitlist. */
  async listUsers(): Promise<WaitlistUserResponse[]> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}/user`,
    });
  }

  /** Get user count and referral breakdown. */
  async userCount(): Promise<UserCountResponse> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}/user/count`,
    });
  }

  /** List blocked users. */
  async blockedUsers(): Promise<WaitlistUserResponse[]> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}/user/blocked`,
    });
  }

  /** Get blocked user count. */
  async blockedUserCount(): Promise<{ total: number }> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}/user/blocked/count`,
    });
  }

  /** Search for a user by email. */
  async searchUser(email: string): Promise<WaitlistUserResponse> {
    return this.http.request({
      method: "GET",
      path: `/v1/wait-list/${this.waitlistId}/user/search`,
      query: { email },
    });
  }

  /** Update a user's status (waiting, invited, converted, churned). */
  async updateUserStatus(params: UpdateUserStatusParams): Promise<void> {
    return this.http.request({
      method: "PATCH",
      path: `/v1/wait-list/${this.waitlistId}/user/status`,
      body: params,
    });
  }

  /** Bulk delete users by email(s). */
  async bulkDeleteUsers(emails: string | string[]): Promise<void> {
    return this.http.request({
      method: "POST",
      path: `/v1/wait-list/${this.waitlistId}/user/bulk-delete`,
      body: Array.isArray(emails) ? emails : [emails],
    });
  }
}

export class WaitlistsResource {
  constructor(private readonly http: HttpClient) {}

  /** Create a new waitlist. */
  async create(params: CreateWaitlistParams): Promise<WaitlistResponse> {
    return this.http.request({
      method: "POST",
      path: "/v1/wait-list",
      body: params,
    });
  }

  /** List all waitlists for the authenticated user. */
  async list(): Promise<WaitlistResponse[]> {
    return this.http.request({
      method: "GET",
      path: "/v1/wait-list",
    });
  }
}
