import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AiServerConnectionController } from "./ai-server-connection.controller";
import { AiServerConnectionService } from "./ai-server-connection.service";

@Module({
  imports: [HttpModule],
  providers: [AiServerConnectionService],
  controllers: [AiServerConnectionController],
})
export class AiServerConnectionModule {}
