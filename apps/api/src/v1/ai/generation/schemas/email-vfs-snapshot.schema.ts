import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

/**
 * Working copy of an email's TSX between saved variants. Edits read and write
 * this, so an in-progress change does not need a new variant on every keystroke;
 * a variant is only cut when the model emits one.
 */
@Schema({ timestamps: true, versionKey: false, collection: "generation_email_vfs_snapshots" })
export class EmailVfsSnapshot extends BasedOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "GenerationEmail", required: true, unique: true })
  email: Types.ObjectId;

  @Prop({ default: "Email.tsx" })
  filePath: string;

  @Prop({ required: true })
  componentCode: string;

  @Prop({ required: true })
  componentHash: string;

  @Prop({ type: Types.ObjectId, ref: "GenerationEmailVariant", default: null })
  sourceVariant: Types.ObjectId | null;
}

export const EmailVfsSnapshotSchema = SchemaFactory.createForClass(EmailVfsSnapshot);
