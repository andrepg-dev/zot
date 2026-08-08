import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type GenerationRunKind = "INITIAL" | "EDIT" | "REGENERATE";
export type GenerationRunStatus =
  | "STREAMING"
  | "COMPLETED"
  | "FAILED"
  | "ABORTED";

/** Token accounting and outcome for a single model run, used for cost tracking. */
@Schema({ timestamps: true, versionKey: false, collection: "generation_runs" })
export class GenerationRun extends BasedOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "GenerationEmail", required: true, index: true })
  email: Types.ObjectId;

  @Prop({ type: String, enum: ["INITIAL", "EDIT", "REGENERATE"], required: true })
  kind: GenerationRunKind;

  @Prop({
    type: String,
    enum: ["STREAMING", "COMPLETED", "FAILED", "ABORTED"],
    default: "STREAMING",
  })
  status: GenerationRunStatus;

  @Prop({ type: Number, default: null })
  inputTokens: number | null;

  @Prop({ type: Number, default: null })
  outputTokens: number | null;

  @Prop({ type: Number, default: null })
  cacheCreationInputTokens: number | null;

  @Prop({ type: Number, default: null })
  cacheReadInputTokens: number | null;

  @Prop({ type: Number, default: null })
  latencyMs: number | null;

  @Prop({ type: String, default: null })
  errorMessage: string | null;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;
}

export const GenerationRunSchema = SchemaFactory.createForClass(GenerationRun);

GenerationRunSchema.index({ email: 1, createdAt: -1 });
