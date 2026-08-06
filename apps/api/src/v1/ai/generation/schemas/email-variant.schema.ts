import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import type { VariableSpec } from "../variable-schema";

/**
 * One saved revision of a generated email. `seq` is monotonic per email and is
 * what the model refers to as "Version N" when the user asks to revert; only
 * the newest MAX_EMAIL_VERSIONS are retained.
 */
@Schema({ timestamps: true, versionKey: false, collection: "generation_email_variants" })
export class GenerationEmailVariant extends BasedOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "GenerationEmail", required: true, index: true })
  email: Types.ObjectId;

  @Prop({ required: true })
  seq: number;

  @Prop({ required: true })
  subject: string;

  /** TSX source emitted by the model. */
  @Prop({ required: true })
  componentCode: string;

  /** Rendered, CSS-inlined HTML for preview and sending. */
  @Prop({ required: true })
  compiledHtml: string;

  @Prop({ type: Array, default: [] })
  variableSchema: VariableSpec[];

  @Prop({ default: null })
  previewUrl: string | null;
}

export const GenerationEmailVariantSchema =
  SchemaFactory.createForClass(GenerationEmailVariant);

GenerationEmailVariantSchema.index({ email: 1, seq: -1 }, { unique: true });
