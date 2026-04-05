import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { AiConversation } from "./schemas/ai-conversation.schema";

@Injectable()
export class AiServerConnectionService {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(AiConversation.name)
    private readonly aiConversationModel: Model<AiConversation>,
  ) {}

  async message_to_ai(
    message: string,
    userId: string,
    conversationId?: string,
  ): Promise<{ agent_response: string; conversationId: string }> {
    const AI_URL_SERVICE = this.configService.get("AI_URL_SERVICE");

    const result = await firstValueFrom(
      this.http.post(AI_URL_SERVICE, {
        message,
        user_id: userId,
        thread_id: conversationId ?? new Types.ObjectId(),
      }),
    );

    const agentResponse = result.data;

    const userMessage = {
      role: "user" as const,
      message,
      created_at: new Date(),
    };

    const assistantMessage = {
      role: "assistant" as const,
      response: agentResponse.response,
      code: agentResponse.code,
      operation_type: agentResponse.operation_type,
      created_at: new Date(),
    };

    let conversation: AiConversation & { _id: Types.ObjectId };

    if (conversationId) {
      const existing = await this.aiConversationModel.findOneAndUpdate(
        { _id: conversationId, owner: new Types.ObjectId(userId) },
        { $push: { messages: { $each: [userMessage, assistantMessage] } } },
        { new: true },
      );

      if (!existing) throw new NotFoundException("Conversation not found");

      conversation = existing;
    } else {
      conversation = await this.aiConversationModel.create({
        owner: new Types.ObjectId(userId),
        title: message.substring(0, 100),
        messages: [userMessage, assistantMessage],
      });
    }

    return {
      ...agentResponse,
      conversationId: conversation._id.toString(),
    };
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.aiConversationModel.findOne({
      _id: conversationId,
      owner: new Types.ObjectId(userId),
    });

    if (!conversation) throw new NotFoundException("Conversation not found");

    return conversation;
  }
}
