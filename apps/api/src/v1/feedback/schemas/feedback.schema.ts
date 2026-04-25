import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  id: false,
})
export class Feedback {
  @Prop({ type: Types.ObjectId, ref: "user", required: true, index: true })
  owner: Types.ObjectId;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
