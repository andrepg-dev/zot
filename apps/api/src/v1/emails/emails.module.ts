import { RESEND } from "@api/src/constants/resend";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ResendModule } from "nestjs-resend";
import { EmailSendingService } from "../core/email-sending/email-sending.service";
import { EmailTemplatesModule } from "../email-templates/email-templates.module";
import { UserQuoteModule } from "../users/user-quote/user-quote.module";
import { WaitListModule } from "../wait-list/wait-list.module";
import { EmailsController } from "./emails.controller";
import { EmailsService } from "./emails.service";
import { EmailSendRecord, EmailSendRecordSchema } from "./schemas/email-send-record.schema";
import { EmailSchema } from "./schemas/email.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailsService.name, schema: EmailSchema },
      { name: EmailSendRecord.name, schema: EmailSendRecordSchema },
    ]),
    ResendModule.forRoot({ apiKey: RESEND.API_KEY }),
    WaitListModule,
    UserQuoteModule,
    EmailTemplatesModule
  ],
  controllers: [EmailsController],
  providers: [EmailsService, EmailSendingService],
  exports: [MongooseModule],
})
export class EmailsModule {}
