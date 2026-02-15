import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type DocumentOfSchema = WaitListUser & Document;

@Schema({
  timestamps: true,
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

  @Prop({ ref: "WaitList", required: true })
  waitlistId: Types.ObjectId;

  @Prop()
  referredBy?: string;

  @Prop()
  position?: number;

  @Virtual({
    get: function (this: DocumentOfSchema): boolean {
      return !!this.referredBy;
    },
  })
  isReferred: boolean;
}

export const WaitListUserSchema = SchemaFactory.createForClass(WaitListUser);
