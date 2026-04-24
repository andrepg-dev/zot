import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type CliDeviceSessionStatus = "pending" | "approved" | "denied" | "expired";

@Schema({ timestamps: true, versionKey: false })
export class CliDeviceSession {
  @Prop({ type: String, required: true, unique: true, index: true })
  deviceCode: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  sessionToken: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  userCode: string;

  @Prop({
    type: String,
    enum: ["pending", "approved", "denied", "expired"],
    default: "pending",
  })
  status: CliDeviceSessionStatus;

  @Prop({ type: String, required: false })
  clientName?: string;

  @Prop({ type: Types.ObjectId, ref: "user", required: false })
  approvedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false })
  apiKeyId?: Types.ObjectId;

  @Prop({ type: String, required: false, select: false })
  apiKeyPlaintext?: string;

  @Prop({ type: Date, required: true, expires: 0 })
  expiresAt: Date;

  @Prop({ type: Number, default: 2 })
  interval: number;

  @Prop({ type: Date, required: false })
  lastPolledAt?: Date;
}

export const CliDeviceSessionSchema = SchemaFactory.createForClass(CliDeviceSession);
