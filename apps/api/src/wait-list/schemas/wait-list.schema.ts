import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class WaitList {
  @Prop({ required: true })
  name: string;

  @Prop()
  URL: string;

  @Prop({ required: true, default: false })
  isSecurityActive: boolean;

  @Prop({ type: mongoose.Schema.ObjectId, ref: "widget" })
  widget: mongoose.Types.ObjectId;

  @Prop()
  webhookURL: string;
}

export const WaitListSchema = SchemaFactory.createForClass(WaitList);
