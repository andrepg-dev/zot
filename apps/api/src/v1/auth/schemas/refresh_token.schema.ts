import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: String, required: true })
  refresh_token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true })
  user: Types.ObjectId;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
