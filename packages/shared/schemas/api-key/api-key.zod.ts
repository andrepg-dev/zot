import { z } from "zod";

export const getApiKeyResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  apiKey: z.string(),
  createdAt: z.date(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(2).max(100),
});

export const updateApiKeySchema = createApiKeySchema.partial();

export type CreateApiKeyValues = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyValues = z.infer<typeof updateApiKeySchema>;

export type ApiKeyResponse = z.infer<typeof getApiKeyResponseSchema>;
