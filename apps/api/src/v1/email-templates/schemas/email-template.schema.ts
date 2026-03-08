import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EmailTemplateStatus } from "../types/email-template";

@Schema({ timestamps: true, versionKey: false })
export class EmailTemplate extends BasedOwnerSchema {
  @Prop({ required: true, default: "Untitled template" })
  alias: string;

  @Prop()
  subject: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  html: string;

  @Prop({
    type: String,
    default: EmailTemplateStatus.DRAFT,
    enum: ["draft", "published"],
  })
  status: "draft" | "published";
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
