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

export const emailSendRecordItemSchema = z.object({
  _id: z.string(),
  quantitySent: z.number(),
  recipientEmails: z.array(z.string()),
  sentSuccessfully: z.number(),
  failedCount: z.number(),
  failedEmails: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type EmailSendRecordItem = z.infer<typeof emailSendRecordItemSchema>;
