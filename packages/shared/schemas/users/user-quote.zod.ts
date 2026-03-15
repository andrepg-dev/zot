import { z } from "zod";

export const domainsQuoteSchema = z.object({
  email: z.number().min(0),
  general: z.number().min(0),
});

export const createUserQuoteSchema = z.object({
  userSignUp: z.number().min(0),
  waitlist: z.number().min(0),
  landingPage: z.number().min(0),
  emailsSent: z.number().min(0),
  emailsTemplates: z.number().min(0),
  domains: domainsQuoteSchema,
});

export const updateUserQuoteSchema = createUserQuoteSchema.partial();

export type DomainsQuoteValues = z.infer<typeof domainsQuoteSchema>;
export type CreateUserQuoteValues = z.infer<typeof createUserQuoteSchema>;
export type UpdateUserQuoteValues = z.infer<typeof updateUserQuoteSchema>;
