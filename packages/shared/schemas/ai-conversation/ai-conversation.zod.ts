import { z } from "zod";

export const updateAiConversationSchema = z.object({
  title: z.string().min(4).max(50)
});

export type UpdateAiConversationValues = z.infer<typeof updateAiConversationSchema>;
