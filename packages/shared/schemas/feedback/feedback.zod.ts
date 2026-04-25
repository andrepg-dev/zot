import { z } from "zod";

export const createFeedbackSchema = z.object({
  message: z.string().min(1, "Feedback cannot be empty").max(2000),
});

export const feedbackResponseSchema = z.object({
  _id: z.string(),
  message: z.string(),
  images: z.array(z.string()).default([]),
  owner: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateFeedbackValues = z.infer<typeof createFeedbackSchema>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
