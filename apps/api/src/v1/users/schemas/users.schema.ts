import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { UserQuote } from "../user-quote/schemas/user-quote.schema";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, maxLength: 100, min: 2 })
  name?: string;

  @Prop({ required: false, maxLength: 100, min: 2 })
  lastName?: string;

  @Prop({ required: true, unique: true, maxLength: 100, index: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false, select: false })
  password?: string;

  @Prop({ default: "local" })
  providers: Array<"google" | "local" | "github">;

  @Prop()
  providerId?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: "FREE", enum: ["FREE", "PREMIUM", "SCALE"] })
  suscriptionPlan: "FREE" | "PREMIUM" | "SCALE";

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserQuote.name, required: true })
  quote: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
