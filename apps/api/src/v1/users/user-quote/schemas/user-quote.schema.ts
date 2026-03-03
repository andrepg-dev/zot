import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false })
export class UserQuote {
  /**
   * EmailSendingQuote, this is to save the actual state of the user
   */
  @Prop({ type: Number, required: true })
  emailSending: number;

  /**
   * Amount of templates saved in the user account
   */
  @Prop({ type: Number, required: true })
  emailTemplates: number;

  /**
   * Amount of wailitst saved
   */
  @Prop({ type: Number, required: true })
  waitlist: number;

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
