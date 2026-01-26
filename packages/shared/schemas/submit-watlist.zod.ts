import { z } from "zod";
import { emailTransform } from "../libs/utils";

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
});

export type SubmitWaitListValues = z.infer<typeof submitWaitlistSchema>;
