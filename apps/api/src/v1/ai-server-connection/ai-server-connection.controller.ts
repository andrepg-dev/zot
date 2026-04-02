import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Post } from "@nestjs/common";
import { Types } from "mongoose";
import { AiServerConnectionService } from "./ai-server-connection.service";
import { AIMessageDto } from "./dto/ai-messages.dto";

@Controller("ai")
export class AiServerConnectionController {
  constructor(private readonly aiService: AiServerConnectionService) {}

  @Post("")
  async send_message_to_ai(@Body() data: AIMessageDto, @UserId() userId: Types.ObjectId) {
    const response = await this.aiService.message_to_ai(data.message, userId.toString());
    return { response: response.agent_response };
  }
}
