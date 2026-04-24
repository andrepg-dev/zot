import { z } from "zod";

export const cliStartRequestSchema = z.object({
  clientName: z.string().max(120).optional(),
});

export const cliStartResponseSchema = z.object({
  deviceCode: z.string(),
  userCode: z.string(),
  verificationUri: z.string(),
  verificationUriComplete: z.string(),
  expiresIn: z.number(),
  interval: z.number(),
});

export const cliSessionStatusSchema = z.enum(["pending", "approved", "denied", "expired"]);

export const cliSessionViewSchema = z.object({
  status: cliSessionStatusSchema,
  clientName: z.string().optional(),
  userCode: z.string(),
  expiresAt: z.union([z.string(), z.date()]),
});

export const approveCliSessionSchema = z
  .object({
    sessionToken: z
      .string()
      .regex(/^[a-f0-9]{64}$/i, "sessionToken must be 64 hex characters")
      .optional(),
    userCode: z
      .string()
      .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/, "userCode must match XXXX-XXXX")
      .optional(),
    apiKeyName: z.string().min(2).max(50),
  })
  .refine((v) => !!v.sessionToken || !!v.userCode, {
    message: "sessionToken or userCode is required",
    path: ["sessionToken"],
  });

export const denyCliSessionSchema = z
  .object({
    sessionToken: z
      .string()
      .regex(/^[a-f0-9]{64}$/i)
      .optional(),
    userCode: z
      .string()
      .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
      .optional(),
  })
  .refine((v) => !!v.sessionToken || !!v.userCode, {
    message: "sessionToken or userCode is required",
    path: ["sessionToken"],
  });

export const pollCliSessionResponseSchema = z.object({
  status: z.enum([
    "authorization_pending",
    "slow_down",
    "approved",
    "access_denied",
    "expired_token",
  ]),
  apiKey: z.string().optional(),
  interval: z.number().optional(),
});

export type CliStartRequest = z.infer<typeof cliStartRequestSchema>;
export type CliStartResponse = z.infer<typeof cliStartResponseSchema>;
export type CliSessionStatus = z.infer<typeof cliSessionStatusSchema>;
export type CliSessionView = z.infer<typeof cliSessionViewSchema>;
export type ApproveCliSessionValues = z.infer<typeof approveCliSessionSchema>;
export type DenyCliSessionValues = z.infer<typeof denyCliSessionSchema>;
export type PollCliSessionResponse = z.infer<typeof pollCliSessionResponseSchema>;
