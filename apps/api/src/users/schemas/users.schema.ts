import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, maxLength: 100, min: 2 })
  name?: string;

  @Prop({ required: false, maxLength: 100, min: 2 })
  last_name?: string;

  @Prop({ required: true, unique: true, maxLength: 100, index: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ default: "local" }) // Local, Google, Github
  providers: Array<"google" | "local" | "github">;

  @Prop()
  providerId?: string;

  @Prop()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
