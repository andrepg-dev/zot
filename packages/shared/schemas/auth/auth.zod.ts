import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const accessTokenResponseSchema = z.object({
  access_token: z.string(),
});

export const userProfileResponseSchema = z.object({
  userId: z.string(),
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type AccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
