import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class RefreshToken extends BasedOwnerSchema {
  @Prop({ type: String, required: true })
  refresh_token: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
