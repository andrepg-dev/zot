import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { type QuoteServiceKey } from "../types/quote-service-key";

@Schema({ versionKey: false, timestamps: { createdAt: true } })
export class QuoteUsageHistory {
  @Prop({ type: Types.ObjectId, ref: "user", required: true, index: true })
  owner: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  service: QuoteServiceKey;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, required: true })
  remainingAfter: number;
}

export const QuoteUsageHistorySchema = SchemaFactory.createForClass(QuoteUsageHistory);
