import { WaitList } from "@api/src/v1/wait-list/schemas/wait-list.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class EmailSecurity {
  @Prop({ type: Types.ObjectId, ref: WaitList.name, required: true, index: true, select: false })
  waitlistId: Types.ObjectId;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Boolean })
  isBlocked: boolean;

  @Prop({ type: Array<string>, default: [] })
  reasons: string[];
}

export const EmailSecuritySchema = SchemaFactory.createForClass(EmailSecurity);

/**
 * The way i want to save this is:
 *
 * based on a wailist, I verify if an emails is legit or not.
 *
 * I hope this should be like this:
 *
 * WaitList {
 *  _id: Types.ObjectId,
 *  security: {
 *    totalUsersBlocked: number,
 *    users: [
 *     {
 *      _id: Types.ObjectId,
 *      email: string,
 *      isBlocked: boolean,
 *      reasons: Array<string>,
 *      createdAt: Date,
 *      updatedAt: Date,
 *     }
 *    ]
 * },
 * }
 */
