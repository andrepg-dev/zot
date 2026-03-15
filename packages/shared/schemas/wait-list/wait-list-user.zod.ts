import { z } from "zod";

export const registerWaitListUserSchema = z.object({
  email: z.string().email(),
  referredBy: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const waitListUserResponseSchema = z.object({
  _id: z.string(),
  email: z.string(),
  waitlistId: z.string(),
  referredBy: z.string().optional(),
  referral_code: z.string(),
  createdAt: z.coerce.date(),
});

export const waitListUserCountResponseSchema = z.object({
  total: z.number(),
  referred: z.number(),
});

export type RegisterWaitListUserValues = z.infer<typeof registerWaitListUserSchema>;
export type WaitListUserResponse = z.infer<typeof waitListUserResponseSchema>;
export type WaitListUserCountResponse = z.infer<typeof waitListUserCountResponseSchema>;
