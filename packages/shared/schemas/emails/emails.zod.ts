import { z } from "zod";
import { zMongoId } from "../../libs/utils";

export const sendEmailSchema = z.object({
  waitlistId: zMongoId,
  quantity: z.number().positive(),
});

export type SendEmailValues = z.infer<typeof sendEmailSchema>;
