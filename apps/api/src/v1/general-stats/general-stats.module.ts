import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  EmailTemplate,
  EmailTemplateSchema,
} from "../email-templates/schemas/email-template.schema";
import { EmailSendRecord, EmailSendRecordSchema } from "../emails/schemas/email-send-record.schema";
import { WaitListUser, WaitListUserSchema } from "../wait-list/schemas/wait-list-user.schema";
import { WaitList, WaitListSchema } from "../wait-list/schemas/wait-list.schema";
import { WaitListModule } from "../wait-list/wait-list.module";
import { GeneralStatsController } from "./general-stats.controller";
import { GeneralStatsService } from "./general-stats.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitList.name, schema: WaitListSchema },
      { name: WaitListUser.name, schema: WaitListUserSchema },
      { name: EmailSendRecord.name, schema: EmailSendRecordSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
    WaitListModule,
  ],
  controllers: [GeneralStatsController, GeneralStatsController],
  providers: [GeneralStatsService],
  exports: [GeneralStatsService],
})
export class GeneralStatsModule {}
