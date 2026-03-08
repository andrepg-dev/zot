import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export const WAITLIST_WEBHOOK_EVENTS = ["waitlist_user_registered"] as const;

export type WaitlistWebhookEventType = (typeof WAITLIST_WEBHOOK_EVENTS)[number];

@Schema({
  timestamps: false,
  versionKey: false,
  id: false,
})
export class WaitlistWebhookEvent {
  @Prop({ type: Types.ObjectId, ref: "WaitList", required: true, index: true, select: false })
  waitlistId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: WAITLIST_WEBHOOK_EVENTS,
    index: true,
  })
  event: WaitlistWebhookEventType;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Object, required: true })
  payload: Record<string, unknown>;

  @Prop({ required: true, enum: ["success", "failed"], index: true })
  status: "success" | "failed";

  @Prop()
  responseStatusCode?: number;

  @Prop()
  responseBody?: string;

  @Prop()
  errorMessage?: string;

  @Prop()
  sentAt?: Date;
}

export const WaitlistWebhookEventSchema = SchemaFactory.createForClass(WaitlistWebhookEvent);

WaitlistWebhookEventSchema.index({ waitlistId: 1, createdAt: -1 });
WaitlistWebhookEventSchema.index({ status: 1, createdAt: -1 });
