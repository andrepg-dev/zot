import { BasedHiddenOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

/**
 * Record of a bulk email send from a waitlist.
 * Stores: waitlist id, timestamp, quantity sent, list of recipients,
 * successfully sent count and failed ones.
 */
@Schema({ timestamps: true, versionKey: false })
export class EmailSendRecord extends BasedHiddenOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "WaitList", required: true, index: true, select: false })
  waitlistId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantitySent: number;

  /** Emails of users to whom the send was attempted (batch recipients) */
  @Prop({ type: [String], required: true, default: [] })
  recipientEmails: string[];

  /** Number of emails sent successfully */
  @Prop({ type: Number, required: true, default: 0 })
  sentSuccessfully: number;

  /** Number of failed sends */
  @Prop({ type: Number, required: true, default: 0 })
  failedCount: number;

  /** List of emails that failed (optional, for debugging or retries) */
  @Prop({ type: [String], default: [] })
  failedEmails: string[];
}

export const EmailSendRecordSchema = SchemaFactory.createForClass(EmailSendRecord);
