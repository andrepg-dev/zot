import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  couponCode: z.string().max(100).optional(),
});

export const checkoutSessionResponseSchema = z.object({
  sessionId: z.string(),
  url: z.string(),
});

export const webhookAcceptedResponseSchema = z.object({
  received: z.boolean(),
});

export type CreateCheckoutSessionValues = z.infer<typeof createCheckoutSessionSchema>;
export type CheckoutSessionResponse = z.infer<typeof checkoutSessionResponseSchema>;
export type WebhookAcceptedResponse = z.infer<typeof webhookAcceptedResponseSchema>;
