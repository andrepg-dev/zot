// ─── SDK Config ───

export interface ZotSDKConfig {
  apiKey: string;
  baseUrl?: string;
}

// ─── Waitlist ───

export interface WebhookConfig {
  url?: string;
  /** Notify webhook every N users registered */
  range?: number;
}

export interface CreateWaitlistParams {
  name: string;
  sendEmailToNewSignup: boolean;
  webhook?: WebhookConfig;
  widgetId?: string;
  isAvailable?: boolean;
  isSecurityActive?: boolean;
  emailTemplateToNewSignUps?: string;
}

export interface UpdateWaitlistParams {
  name?: string;
  sendEmailToNewSignup?: boolean;
  webhook?: WebhookConfig;
  widgetId?: string;
  isAvailable?: boolean;
  isSecurityActive?: boolean;
  emailTemplateToNewSignUps?: string;
}

export interface WaitlistResponse {
  _id: string;
  name: string;
  sendEmailToNewSignup: boolean;
  webhook?: WebhookConfig;
  widget_id?: string;
  isAvailable: boolean;
  isSecurityActive?: boolean;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Waitlist Users ───

export type UserSource = "social" | "email" | "paid_ads";
export type UserStatus = "waiting" | "invited" | "converted" | "churned";

export interface AddUserParams {
  email: string;
  name?: string;
  referredBy?: string;
  source?: UserSource;
  metadata?: Record<string, unknown>;
}

export interface WaitlistUserResponse {
  _id: string;
  email: string;
  name?: string;
  waitlistId: string;
  referredBy?: string;
  referral_code: string;
  source?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface UserCountResponse {
  total: number;
  referred: number;
}

export interface UpdateUserStatusParams {
  email: string;
  status: UserStatus;
}

// ─── HTTP ───

export class ZotAPIError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: unknown,
    message?: string,
  ) {
    super(message ?? `Zot API error ${statusCode}`);
    this.name = "ZotAPIError";
  }
}
