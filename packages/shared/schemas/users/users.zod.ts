import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().max(100),
  password: z.string().max(100),
  avatar: z.string().url().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type LoginUserValues = z.infer<typeof loginUserSchema>;
