import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, versionKey: false })
export class WaitList extends BasedOwnerSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: true })
  send_email_to_new_signup: boolean;

  @Prop({ required: true, default: false })
  is_security_active: boolean;

  @Prop({ required: true, default: true })
  is_available: boolean;

  // General configuration
  @Prop()
  emails_sent: number;

  @Prop()
  fake_users_blocked: number;

  @Prop()
  webhook_url: string;
}

export const WaitListSchema = SchemaFactory.createForClass(WaitList);
