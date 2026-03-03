import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false })
export class UserQuote {
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

  @Virtual({
    options: {
      ref: "User",
      localField: "_id",
      foreignField: "quote",
      justOne: true,
    },
  })
  owner: Types.ObjectId;
}

export const UserQuoteSchema = SchemaFactory.createForClass(UserQuote);
