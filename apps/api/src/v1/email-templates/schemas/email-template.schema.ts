import { BasedHiddenOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { EmailTemplateStatus } from "../types/email-template";

@Schema({ timestamps: true, versionKey: false })
export class EmailTemplate extends BasedHiddenOwnerSchema {
  @Prop({ required: true, default: "Untitled template" })
  alias: string;

  @Prop()
  subject: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  html: string;

  @Prop({ required: true })
  preview: string;

  @Prop()
  variables: Array<string>;

  @Prop({
    type: String,
    default: EmailTemplateStatus.DRAFT,
    enum: ["draft", "published"],
  })
  status: "draft" | "published";
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
