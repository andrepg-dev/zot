import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  id: false,
})
export class WaitList {
  // hidden owner
  @Prop({ type: Types.ObjectId, ref: "user", required: true, index: true, select: false })
  owner: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: true })
  sendEmailToNewSignup: boolean;

  @Prop({ type: Types.ObjectId, required: false })
  emailTemplateToNewSignUps: Types.ObjectId;

  @Prop({ required: true, default: false })
  isSecurityActive: boolean;

  @Prop({ required: true, default: true })
  isAvailable: boolean;

  @Prop()
  fakeUsersBlocked: number;

  @Prop({
    type: { url: String, range: Number },
    required: false,
  })
  webhook: {
    url: string | undefined;
    range: number;
  };

  @Prop({
    type: {
      connected: { type: Boolean, default: false },
      connectedAt: { type: Date, required: false },
      lastActivityAt: { type: Date, required: false },
      channel: { type: String, required: false },
    },
    default: { connected: false },
  })
  integration: {
    connected: boolean;
    connectedAt?: Date;
    lastActivityAt?: Date;
    channel?: "api";
  };
}

export const WaitListSchema = SchemaFactory.createForClass(WaitList);
