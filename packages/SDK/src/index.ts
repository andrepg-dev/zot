import { HttpClient } from "./http";
import { WaitlistResource, WaitlistsResource } from "./resources/waitlist";
import type { ZotSDKConfig } from "./types";

const DEFAULT_BASE_URL = "http://localhost:3010";

export class ZotSDK {
  private readonly http: HttpClient;

  readonly waitlists: WaitlistsResource;

  constructor(config: ZotSDKConfig) {
    if (!config.apiKey) {
      throw new Error("ZotSDK: apiKey is required");
    }

    const baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.http = new HttpClient(baseUrl, config.apiKey);
    this.waitlists = new WaitlistsResource(this.http);
  }

  /** Get a waitlist resource by ID for user & stats operations. */
  waitlist(waitlistId: string): WaitlistResource {
    return new WaitlistResource(this.http, waitlistId);
  }
}

export { ZotAPIError } from "./types";
export type {
  ZotSDKConfig,
  CreateWaitlistParams,
  UpdateWaitlistParams,
  WaitlistResponse,
  AddUserParams,
  WaitlistUserResponse,
  UserCountResponse,
  UpdateUserStatusParams,
  UserSource,
  UserStatus,
  WebhookConfig,
} from "./types";
