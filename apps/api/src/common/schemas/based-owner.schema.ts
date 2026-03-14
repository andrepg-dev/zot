import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class BasedOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "user", required: true, index: true })
  owner: Types.ObjectId;
}

/**
 * Owner hidden by default
 */
@Schema()
export class BasedHiddenOwnerSchema {
  @Prop({ type: Types.ObjectId, ref: "user", required: true, index: true, select: false })
  owner: Types.ObjectId;
}
