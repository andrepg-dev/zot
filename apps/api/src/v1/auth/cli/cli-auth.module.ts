import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ApiKeyModule } from "../../api-key/api-key.module";
import { CliAuthController } from "./cli-auth.controller";
import { CliAuthService } from "./cli-auth.service";
import { CliDeviceSession, CliDeviceSessionSchema } from "./schemas/cli-device-session.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CliDeviceSession.name, schema: CliDeviceSessionSchema }]),
    ApiKeyModule,
  ],
  controllers: [CliAuthController],
  providers: [CliAuthService],
  exports: [CliAuthService],
})
export class CliAuthModule {}
