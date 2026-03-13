import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export interface DomainsQuote {
  email: number;
  general: number;
}

@Schema({ versionKey: false, timestamps: { updatedAt: true, createdAt: false } })
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

  @Prop({
    type: { email: { type: Number, required: true }, general: { type: Number, required: true } },
    required: true,
    default: () => ({ email: 0, general: 0 }),
    _id: false,
  })
  domains: DomainsQuote;
}

export const UserQuoteSchema = SchemaFactory.createForClass(UserQuote);
