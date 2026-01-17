import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type WaitListDocument = HydratedDocument<WaitList>;

@Schema({ timestamps: true })
export class WaitList {
  @Prop()
  name: string;
}
