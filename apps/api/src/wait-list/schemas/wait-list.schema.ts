import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class WaitList {
  @Prop({ required: true })
  name: string;

  @Prop()
  URL: string;

  @Prop({ required: true, default: false })
  is_security_active: boolean;

  @Prop({ type: mongoose.Schema.ObjectId, ref: "widget" })
  widget: mongoose.Types.ObjectId;

  @Prop()
  webhook_url: string;
}

export const WaitListSchema = SchemaFactory.createForClass(WaitList);
