import { HttpClient } from "./http";
import { WaitlistResource, WaitlistsResource } from "./resources/waitlist";
import type { ZotSDKConfig } from "./types";

const BASE_URL = "https://api.zot.so";

export class ZotSDK {
  private readonly http: HttpClient;
  readonly waitlists: WaitlistsResource;

  constructor(config: ZotSDKConfig) {
    if (!config.apiKey) {
      throw new Error("ZotSDK: apiKey is required");
    }

    this.http = new HttpClient(BASE_URL, config.apiKey);
    this.waitlists = new WaitlistsResource(this.http);
  }

  /** Get a waitlist resource by ID for user & stats operations. */
  waitlist(waitlistId: string): WaitlistResource {
    return new WaitlistResource(this.http, waitlistId);
  }
}

export { ZotAPIError } from "./types";
export type {
  AddUserParams,
  CreateWaitlistParams,
  UpdateUserStatusParams,
  UpdateWaitlistParams,
  UserCountResponse,
  UserSource,
  UserStatus,
  WaitlistResponse,
  WaitlistUserResponse,
  WebhookConfig,
  ZotSDKConfig
} from "./types";

