import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type DocumentOfSchema = WaitListUser & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret: Record<string, any>) {
      delete ret.waitlist_id;
      return ret;
    },
  },
  id: false,
})
export class WaitListUser {
  @Prop({ required: true })
  email: string;

  @Prop({ ref: "WaitList", required: true })
  waitlist_id: Types.ObjectId;

  @Prop()
  referred_by?: string;

  @Prop()
  position?: number;

  @Virtual({
    get: function (this: DocumentOfSchema): boolean {
      return !!this.referred_by;
    },
  })
  is_referred: boolean;
}

export const WaitListUserSchema = SchemaFactory.createForClass(WaitListUser);
