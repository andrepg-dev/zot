import { z } from "zod";
import { zMongoId } from "../../libs/utils";

export const webhookConfigSchema = z.object({
  url: z.string().url().min(1),
  range: z.number().int().min(1),
});

export const createWaitListSchema = z.object({
  name: z.string().min(1),
  sendEmailToNewSignup: z.boolean().optional(),
  webhook: webhookConfigSchema.optional(),
  widget_id: zMongoId.optional(),
  isAvailable: z.boolean().optional(),
  isSecurityActive: z.boolean().optional(),
});

export const updateWaitListSchema = createWaitListSchema.partial();

export const waitListResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  sendEmailToNewSignup: z.boolean(),
  webhook: z
    .object({
      url: z.string(),
      range: z.number(),
    })
    .optional(),
  widget_id: z.string().optional(),
  isAvailable: z.boolean(),
  user_id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type WebhookConfigValues = z.infer<typeof webhookConfigSchema>;
export type CreateWaitListValues = z.infer<typeof createWaitListSchema>;
export type UpdateWaitListValues = z.infer<typeof updateWaitListSchema>;
export type WaitListResponse = z.infer<typeof waitListResponseSchema>;
