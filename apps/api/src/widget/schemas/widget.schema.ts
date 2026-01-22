import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Widget {
  @Prop({ required: true })
  user_email: string;

  @Prop({ default: false })
  is_refered: boolean;
}

export const WidgetSchema = SchemaFactory.createForClass(Widget);
