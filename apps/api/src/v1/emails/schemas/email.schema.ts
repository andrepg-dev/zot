import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Email extends BasedOwnerSchema {
  @Prop({ type: String })
  waitlistId: string;

  @Prop({ type: String })
  waitlistUserId: string;

  @Prop({ type: Number })
  emailAmountSending: number;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
