import { Module } from "@nestjs/common";
import { EmailsModule } from "../emails/emails.module";
import { WaitListModule } from "../wait-list/wait-list.module";
import { GeneralStatsController } from "./general-stats.controller";
import { GeneralStatsService } from "./general-stats.service";

@Module({
  imports: [WaitListModule, EmailsModule],
  controllers: [GeneralStatsController],
  providers: [GeneralStatsService],
  exports: [GeneralStatsService],
})
export class GeneralStatsModule {}
