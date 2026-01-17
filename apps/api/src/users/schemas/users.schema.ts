import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, maxLength: 100, min: 2 })
  name: string;

  @Prop({ required: true, maxLength: 100, min: 2 })
  last_name: string;

  @Prop({ required: true, unique: true, maxLength: 100 })
  email: string;

  @Prop({ required: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
