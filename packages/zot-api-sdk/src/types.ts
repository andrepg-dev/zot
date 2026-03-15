export interface ZotSDKOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface WebhookConfig {
  url?: string;
  range?: number;
}

export interface CreateWaitListOptions {
  name: string;
  emailSending?: boolean;
  enableSecurity?: boolean;
  webhook?: WebhookConfig;
  widgetId?: string;
}

export interface UpdateWaitListOptions {
  id: string;
  name?: string;
  emailSending?: boolean;
  enableSecurity?: boolean;
  isAvailable?: boolean;
  webhook?: WebhookConfig;
  widgetId?: string;
}

export interface SaveUserOptions {
  waitlistId: string;
  email: string;
  referredBy?: string;
}

export interface FindWaitListOptions {
  id?: string;
}

export interface FindWaitListUsersOptions {
  waitlistId: string;
}

export interface RemoveUserOptions {
  waitlistId: string;
  email: string;
}

export interface WaitList {
  id: string;
  name: string;
  sendEmailToNewSignup: boolean;
  webhook?: object;
  widgetId?: string;
  isAvailable: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaitListUser {
  id: string;
  email: string;
  waitlistId: string;
  referredBy?: string;
  referralCode: string;
  createdAt: Date;
}

export interface WaitListUserCount {
  total: number;
  referred: number;
}
