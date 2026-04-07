import { z } from "zod";

export const emailTemplateStatusEnum = z.enum(["draft", "published"]);

export const createEmailTemplateSchema = z.object({
  alias: z.string().min(1),
  subject: z.string().optional(),
  code: z.string().min(1),
  status: emailTemplateStatusEnum,
});

export const updateEmailTemplateSchema = createEmailTemplateSchema.partial();

export const emailTemplateSchema = createEmailTemplateSchema.extend({
  _id: z.string(),
  html: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type EmailTemplateStatus = z.infer<typeof emailTemplateStatusEnum>;
export type CreateEmailTemplateValues = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateValues = z.infer<typeof updateEmailTemplateSchema>;
export type EmailTemplate = z.infer<typeof emailTemplateSchema>;
