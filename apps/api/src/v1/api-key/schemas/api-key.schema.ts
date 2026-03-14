import { BasedHiddenOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class ApiKey extends BasedHiddenOwnerSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  apiKey: string;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
