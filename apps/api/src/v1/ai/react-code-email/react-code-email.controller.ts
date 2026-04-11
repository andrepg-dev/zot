import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AIMessageDto, UpdateReactCodeEmailConversation } from "./dto/ai-messages.dto";
import { AiServerConnectionService } from "./react-code-email.service";

@Controller("ai/react-code-email")
export class AiServerConnectionController {
  constructor(private readonly aiService: AiServerConnectionService) {}

  @Post("")
  async send_message_to_ai(@Body() data: AIMessageDto, @UserId() userId: Types.ObjectId) {
    return await this.aiService.message_to_ai(data.message, userId.toString(), data.conversationId);
  }

  @Get("conversations")
  async getConversations(@UserId() userId: Types.ObjectId) {
    return await this.aiService.getConversations(userId);
  }

  @Get(":conversationId")
  async getConversation(
    @Param("conversationId") conversationId: string,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.aiService.getConversation(conversationId, userId.toString());
  }

  @Patch(":conversationId")
  async updateConversation(
    @Param("conversationId", ParseObjectIdPipe) conversationId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
    @Body() data: UpdateReactCodeEmailConversation,
  ) {
    return await this.aiService.editConversation(conversationId, userId, data);
  }

  @Delete(":conversationId")
  async deleteConversation(
    @Param("conversationId", ParseObjectIdPipe) conversationId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.aiService.deleteConversation(conversationId, userId);
  }
}
