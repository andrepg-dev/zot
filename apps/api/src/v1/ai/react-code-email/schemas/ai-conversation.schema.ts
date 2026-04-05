import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum AiOperationType {
  CODE = "code",
  TEXT = "text",
  NORMAL = "normal",
}

@Schema({ _id: true, versionKey: false })
export class AiMessage {
  @Prop({ required: true })
  role: "user" | "assistant";

  @Prop()
  message: string;

  @Prop()
  code: string;

  @Prop()
  response: string;

  @Prop({ type: String, enum: Object.values(AiOperationType) })
  operation_type: AiOperationType;
}

export const AiMessageSchema = SchemaFactory.createForClass(AiMessage);

@Schema({ timestamps: true, versionKey: false })
export class AiConversation extends BasedOwnerSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [AiMessageSchema], default: [] })
  messages: AiMessage[];
}

export const AiConversationSchema = SchemaFactory.createForClass(AiConversation);
