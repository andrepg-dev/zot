import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class WaitList {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: true })
  send_email_to_new_signup: boolean;

  @Prop({ required: true, default: false })
  is_security_active: boolean;

  @Prop({ type: mongoose.Schema.ObjectId, ref: "widget" })
  widget: mongoose.Types.ObjectId;

  @Prop({ required: true, default: true })
  is_available: boolean;

  // General configuration
  @Prop()
  emails_sent: number;

  @Prop()
  fake_users_blocked: number;

  @Prop()
  webhook_url: string;
}

export const WaitListSchema = SchemaFactory.createForClass(WaitList);
