import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { WaitListUser } from "./wait-list-user.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false,
})
export class WaitList extends BasedOwnerSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: true })
  sendEmailToNewSignup: boolean;

  @Prop({ required: true, default: false })
  isSecurityActive: boolean;

  @Prop({ required: true, default: true })
  isAvailable: boolean;

  // General configuration
  @Prop()
  emailsSent: number;

  @Prop()
  fakeUsersBlocked: number;

  @Prop()
  webhookUrl: string;

  @Virtual({ options: { ref: "WaitListUser", localField: "_id", foreignField: "waitlistId" } })
  users: WaitListUser[];
}

export const WaitListSchema = SchemaFactory.createForClass(WaitList);
