import { z } from "zod";

export const waitListUserSources = [
  "organic",
  "referral",
  "social",
  "email",
  "paid_ads",
] as const;

/** Sources the user can explicitly set — organic/referral are auto-determined */
export const waitListUserSelectableSources = [
  "social",
  "email",
  "paid_ads",
] as const;

export const waitListUserStatuses = [
  "waiting",
  "invited",
  "converted",
  "churned",
] as const;

export const registerWaitListUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  referredBy: z.string().optional(),
  source: z.enum(waitListUserSelectableSources).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const waitListUserResponseSchema = z.object({
  _id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  waitlistId: z.string(),
  referredBy: z.string().optional(),
  referral_code: z.string(),
  position: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  source: z.enum(waitListUserSources).optional(),
  status: z.enum(waitListUserStatuses).optional(),
  isReferred: z.boolean().optional(),
  createdAt: z.coerce.date(),
});

export const waitListUserCountResponseSchema = z.object({
  total: z.number(),
  referred: z.number(),
});

export type WaitListUserSource = (typeof waitListUserSources)[number];
export type WaitListUserStatus = (typeof waitListUserStatuses)[number];
export type RegisterWaitListUserValues = z.infer<typeof registerWaitListUserSchema>;
export type WaitListUserResponse = z.infer<typeof waitListUserResponseSchema>;
export type WaitListUserCountResponse = z.infer<typeof waitListUserCountResponseSchema>;
