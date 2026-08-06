import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

/**
 * One AI-generated email project. Holds the brief and the pointer to whichever
 * variant is currently live; the generated code itself lives on EmailVariant so
 * every revision is retained and can be restored.
 *
 * Madoo scopes these by workspace. Zot has no workspace concept, so ownership
 * is the user, matching the rest of the API.
 */
@Schema({ timestamps: true, versionKey: false, collection: "generation_emails" })
export class GenerationEmail extends BasedOwnerSchema {
  @Prop({ required: true, default: "" })
  prompt: string;

  @Prop({ default: "Untitled email" })
  title: string;

  @Prop({ type: String, enum: ["draft", "published"], default: "draft" })
  status: "draft" | "published";

  /** Variant currently shown in the editor and used for exports. */
  @Prop({ type: Types.ObjectId, ref: "GenerationEmailVariant", default: null })
  activeVariant: Types.ObjectId | null;

  @Prop({ default: false })
  starred: boolean;
}

export const GenerationEmailSchema = SchemaFactory.createForClass(GenerationEmail);

GenerationEmailSchema.index({ owner: 1, createdAt: -1 });
