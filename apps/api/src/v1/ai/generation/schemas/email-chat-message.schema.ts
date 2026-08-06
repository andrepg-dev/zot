import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type EmailChatRole = "USER" | "ASSISTANT";
export type EmailChatKind = "TEXT" | "THINKING" | "TOOL_CALL" | "ERROR";

/**
 * One turn in the editor chat. TOOL_CALL rows store a JSON payload rather than
 * prose so the timeline can render tool activity; see emailChatToolCallPayload.
 */
@Schema({ timestamps: true, versionKey: false, collection: "generation_email_chat_messages" })
export class EmailChatMessage extends BasedOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "GenerationEmail", required: true, index: true })
  email: Types.ObjectId;

  @Prop({ type: String, enum: ["USER", "ASSISTANT"], required: true })
  role: EmailChatRole;

  @Prop({
    type: String,
    enum: ["TEXT", "THINKING", "TOOL_CALL", "ERROR"],
    default: "TEXT",
  })
  kind: EmailChatKind;

  @Prop({ required: true })
  content: string;

  /** Public URLs of images the user attached, so attachments survive a reload. */
  @Prop({ type: [String], default: [] })
  imageUrls: string[];

  /** Preview element selected via the visual editor when this turn was sent. */
  @Prop({ default: null })
  selectedElementLabel: string | null;

  /** Design skill ids attached in the composer for this turn. */
  @Prop({ type: [String], default: [] })
  skills: string[];

  /**
   * Assistant rows produced by regenerating the same turn share a groupId, so
   * the UI can offer version navigation and older siblings stay out of the
   * model's context.
   */
  @Prop({ default: null, index: true })
  groupId: string | null;

  @Prop({ type: String, enum: ["LIKE", "DISLIKE"], default: null })
  feedback: "LIKE" | "DISLIKE" | null;

  @Prop({ default: null })
  feedbackComment: string | null;

  /** Set by `timestamps: true`; declared so ordering logic can read them. */
  createdAt: Date;
  updatedAt: Date;
}

export const EmailChatMessageSchema = SchemaFactory.createForClass(EmailChatMessage);

EmailChatMessageSchema.index({ email: 1, createdAt: -1 });
