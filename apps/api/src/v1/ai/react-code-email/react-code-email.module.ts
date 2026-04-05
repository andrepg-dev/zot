import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AiServerConnectionController } from "./react-code-email.controller";
import { AiServerConnectionService } from "./react-code-email.service";
import { AiConversation, AiConversationSchema } from "./schemas/ai-conversation.schema";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: AiConversation.name, schema: AiConversationSchema }]),
  ],
  providers: [AiServerConnectionService],
  controllers: [AiServerConnectionController],
})
export class AiServerConnectionModule {}
