import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z.string().min(2).max(100),
});

export const updateApiKeySchema = createApiKeySchema.partial();

export type CreateApiKeyValues = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyValues = z.infer<typeof updateApiKeySchema>;
