import { z } from "zod";
import { zMongoId } from "../../libs/utils";

export const sendEmailSchema = z.object({
  waitlistId: zMongoId,
  quantity: z.number().positive(),
});

export type SendEmailValues = z.infer<typeof sendEmailSchema>;

export const emailSendRecordSchema = z.object({
  createdAt: z.string(),
  sent: z.number(),
  failed: z.number(),
});

export type EmailSendRecord = z.infer<typeof emailSendRecordSchema>;

export const emailPayloadSchema = z.object({
  from: z.string(),
  subject: z.string(),
  options: z.object({
    html: z.string(),
    replyTo: z.string().optional(),
    text: z.string().optional(),
  }),
});

export type EmailPayload = z.infer<typeof emailPayloadSchema>;

export const sendEmailToUsersByIdSchema = z.object({
  users: z.array(zMongoId).min(1),
  templateId: z.string().optional(),
  mapping: z.record(z.string(), z.string()).optional(),
  variables: z.record(z.string(), z.unknown()).optional()
});

export type SendEmailToUsersByIdValues = z.infer<typeof sendEmailToUsersByIdSchema>;

export const emailSendRecordItemSchema = z.object({
  _id: z.string(),
  quantitySent: z.number(),
  recipientEmails: z.array(z.string()),
  sentSuccessfully: z.number(),
  failedCount: z.number(),
  failedEmails: z.array(z.string()),
  payload: emailPayloadSchema,
  template: z.object({
    preview: z.string(),
    alias: z.string(),
    subject: z.string().optional(),
    code: z.string().optional(),
    html: z.string().optional(),
    status: z.string().optional(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type EmailSendRecordItem = z.infer<typeof emailSendRecordItemSchema>;
