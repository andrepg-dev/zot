import { z } from "zod";

/** A merge field emitted alongside a generated email. */
export const generationVariableSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  default: z.string(),
  role: z.enum(["text", "url", "image", "date"]).optional(),
  scope: z.enum(["dynamic", "static"]),
});

export const generationSkillSchema = z.object({
  name: z.string(),
  kind: z.enum(["technique", "font"]),
  label: z.string(),
  summary: z.string(),
  example: z.string(),
});

export const generationEmailStatusEnum = z.enum(["draft", "generating", "ready", "failed"]);

export const generationVariantSchema = z.object({
  _id: z.string(),
  seq: z.number(),
  subject: z.string(),
  componentCode: z.string(),
  compiledHtml: z.string(),
  variableSchema: z.array(generationVariableSchema).default([]),
  previewUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const generationVersionSchema = z.object({
  _id: z.string(),
  seq: z.number(),
  subject: z.string(),
  previewUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const generationEmailSchema = z.object({
  _id: z.string(),
  prompt: z.string(),
  title: z.string(),
  status: generationEmailStatusEnum,
  starred: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const generationEmailDetailSchema = generationEmailSchema.extend({
  variant: generationVariantSchema.nullable(),
});

export const generationChatMessageSchema = z.object({
  _id: z.string(),
  role: z.enum(["USER", "ASSISTANT"]),
  kind: z.enum(["TEXT", "THINKING", "TOOL_CALL", "ERROR"]),
  content: z.string(),
  imageUrls: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  groupId: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

/** Brief that starts a new generated email. */
export const createGenerationEmailSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(10, "Describe the email in at least 10 characters")
    .max(8000, "Brief is too long"),
  skills: z.array(z.string()).max(4, "Pick at most 4 skills").optional(),
});

/** Follow-up instruction against the current draft. */
export const editGenerationEmailSchema = z.object({
  instruction: z
    .string()
    .trim()
    .min(2, "Describe the change")
    .max(8000, "Instruction is too long"),
  skills: z.array(z.string()).max(4, "Pick at most 4 skills").optional(),
});

export type GenerationVariable = z.infer<typeof generationVariableSchema>;
export type GenerationSkill = z.infer<typeof generationSkillSchema>;
export type GenerationVariant = z.infer<typeof generationVariantSchema>;
export type GenerationVersion = z.infer<typeof generationVersionSchema>;
export type GenerationEmail = z.infer<typeof generationEmailSchema>;
export type GenerationEmailDetail = z.infer<typeof generationEmailDetailSchema>;
export type GenerationChatMessage = z.infer<typeof generationChatMessageSchema>;
export type GenerationEmailStatus = z.infer<typeof generationEmailStatusEnum>;
export type CreateGenerationEmailValues = z.infer<typeof createGenerationEmailSchema>;
export type EditGenerationEmailValues = z.infer<typeof editGenerationEmailSchema>;
