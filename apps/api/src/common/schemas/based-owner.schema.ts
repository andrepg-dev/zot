import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class BasedOwnerSchema {
  @Prop({ ref: "user", required: true, index: true })
  owner: Types.ObjectId;
}
