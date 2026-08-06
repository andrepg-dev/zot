import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type GenerationRunKind = "INITIAL" | "EDIT" | "REGENERATE";
export type GenerationRunStatus = "STARTED" | "COMPLETED" | "FAILED" | "ABORTED";

/** Token accounting and outcome for a single model run, used for cost tracking. */
@Schema({ timestamps: true, versionKey: false, collection: "generation_runs" })
export class GenerationRun extends BasedOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "GenerationEmail", required: true, index: true })
  email: Types.ObjectId;

  @Prop({ type: String, enum: ["INITIAL", "EDIT", "REGENERATE"], required: true })
  kind: GenerationRunKind;

  @Prop({
    type: String,
    enum: ["STARTED", "COMPLETED", "FAILED", "ABORTED"],
    default: "STARTED",
  })
  status: GenerationRunStatus;

  @Prop({ default: null })
  inputTokens: number | null;

  @Prop({ default: null })
  outputTokens: number | null;

  @Prop({ default: null })
  cacheCreationInputTokens: number | null;

  @Prop({ default: null })
  cacheReadInputTokens: number | null;

  @Prop({ default: null })
  latencyMs: number | null;

  @Prop({ default: null })
  errorMessage: string | null;

  @Prop({ default: null })
  completedAt: Date | null;
}

export const GenerationRunSchema = SchemaFactory.createForClass(GenerationRun);

GenerationRunSchema.index({ email: 1, createdAt: -1 });
