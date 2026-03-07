import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: String })
  refresh_token: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
