import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class UserQuote {
  @Prop({ type: Types.ObjectId, ref: "user", required: true, index: true, select: false })
  owner: Types.ObjectId;

  @Prop({ type: Number, required: true })
  userSignUp: number;

  @Prop({ type: Number, required: true })
  waitlist: number;

  @Prop({ type: Number, required: true })
  landingPage: number;

  @Prop({ type: Number, required: true })
  emailsSent: number;

  @Prop({ type: Number, required: true })
  emailsTemplates: number;

  @Prop({ type: Number, required: true })
  domains: number;
}

export const UserQuoteSchema = SchemaFactory.createForClass(UserQuote);
