import { z } from "zod";

export const reactToHtmlSchema = z.object({
  code: z.string().min(1),
  variables: z.record(z.string(), z.unknown()).optional(),
});

export const reactToHtmlResponseSchema = z.object({
  html: z.string(),
});

export type ReactToHtmlValues = z.infer<typeof reactToHtmlSchema>;
export type ReactToHtmlResponse = z.infer<typeof reactToHtmlResponseSchema>;
