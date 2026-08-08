import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type DocumentOfSchema = WaitListUser & Document;

export const WAITLIST_USER_SOURCES = [
  "organic",
  "referral",
  "social",
  "email",
  "paid_ads",
] as const;
export type WaitListUserSource = (typeof WAITLIST_USER_SOURCES)[number];

/** Sources the user can explicitly set — organic/referral are auto-determined */
export const WAITLIST_USER_SELECTABLE_SOURCES = ["social", "email", "paid_ads"] as const;
export type WaitListUserSelectableSource = (typeof WAITLIST_USER_SELECTABLE_SOURCES)[number];

export const WAITLIST_USER_STATUSES = ["waiting", "invited", "converted", "churned"] as const;
export type WaitListUserStatus = (typeof WAITLIST_USER_STATUSES)[number];

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret: Record<string, any>) {
      delete ret.waitlistId;
      return ret;
    },
  },
  id: false,
})
export class WaitListUser {
  @Prop({ required: true })
  email: string;

  @Prop({ ref: "WaitList", required: true, select: false })
  waitlistId: Types.ObjectId;

  @Prop()
  name?: string;

  @Prop()
  referredBy?: string;

  @Prop()
  position?: number;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: String, enum: WAITLIST_USER_SOURCES, default: "organic" })
  source: WaitListUserSource;

  @Prop({ type: String, enum: WAITLIST_USER_STATUSES, default: "waiting" })
  status: WaitListUserStatus;

  @Virtual({
    get: function (this: DocumentOfSchema): boolean {
      return !!this.referredBy;
    },
  })
  isReferred: boolean;
}

export const WaitListUserSchema = SchemaFactory.createForClass(WaitListUser);
