import { z } from "zod";

export const PAID_PLANS = ["STARTER", "PREMIUM"] as const;

export const paidPlanSchema = z.enum(PAID_PLANS);

export const BILLING_INTERVALS = ["monthly", "yearly"] as const;
export const billingIntervalSchema = z.enum(BILLING_INTERVALS);

export const createCheckoutSessionSchema = z.object({
  plan: paidPlanSchema,
  interval: billingIntervalSchema.optional().default("monthly"),
  couponCode: z.string().max(100).optional(),
});

export const checkoutSessionResponseSchema = z.object({
  sessionId: z.string(),
  url: z.string(),
});

export const webhookAcceptedResponseSchema = z.object({
  received: z.boolean(),
});

export type PaidPlan = z.infer<typeof paidPlanSchema>;
export type BillingInterval = z.infer<typeof billingIntervalSchema>;
export type CreateCheckoutSessionValues = z.infer<typeof createCheckoutSessionSchema>;
export type CheckoutSessionResponse = z.infer<typeof checkoutSessionResponseSchema>;
export type WebhookAcceptedResponse = z.infer<typeof webhookAcceptedResponseSchema>;
