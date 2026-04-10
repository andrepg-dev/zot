import { z } from "zod";
import { emailTransform } from "../../libs/utils";

export const submitWaitlistSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Field required" })
    .max(30, { message: "Name must be less than 30 characters" }),
  url: z
    .string()
    .optional()
    .transform(emailTransform)
    .pipe(z.string().url().optional()),
  sendEmail: z.boolean().optional(),
  addSecurity: z.boolean().optional(),
  webhookUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  emailTemplateToNewSignUps: z.string().optional(),
});

export type SubmitWaitListValues = z.infer<typeof submitWaitlistSchema>;
