import { RESEND } from "@api/src/constants/resend";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ResendModule } from "nestjs-resend";
import { EmailSecurityService } from "../core/email-security/email-security.service";
import {
  EmailSecurity,
  EmailSecuritySchema,
} from "../core/email-security/schemas/email-security.schema";
import { EmailSendingService } from "../core/email-sending/email-sending.service";
import {
  EmailTemplate,
  EmailTemplateSchema,
} from "../email-templates/schemas/email-template.schema";
import {
  EmailSendRecord,
  EmailSendRecordSchema,
} from "../emails/schemas/email-send-record.schema";
import { UserQuoteModule } from "../users/user-quote/user-quote.module";
import { UsersModule } from "../users/users.module";
import { WaitListUser, WaitListUserSchema } from "./schemas/wait-list-user.schema";
import { WaitList, WaitListSchema } from "./schemas/wait-list.schema";
import {
  WaitlistWebhookEvent,
  WaitlistWebhookEventSchema,
} from "./schemas/waitlist-webhooks-events.schema";
import { StatsModule } from "./stats/stats.module";
import { WaitListUserController } from "./wait-list-user/wait-list-user.controller";
import { WaitListUserService } from "./wait-list-user/wait-list-user.service";
import { WaitListController } from "./wait-list.controller";
import { WaitListService } from "./wait-list.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitList.name, schema: WaitListSchema },
      { name: WaitListUser.name, schema: WaitListUserSchema },
      { name: EmailSecurity.name, schema: EmailSecuritySchema },
      { name: WaitlistWebhookEvent.name, schema: WaitlistWebhookEventSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
      { name: EmailSendRecord.name, schema: EmailSendRecordSchema },
    ]),
    ResendModule.forRoot({ apiKey: RESEND.API_KEY }),
    HttpModule,
    StatsModule,
    UserQuoteModule,
    UsersModule,
  ],
  controllers: [WaitListController, WaitListUserController],
  providers: [WaitListService, WaitListUserService, EmailSecurityService, EmailSendingService],
  exports: [WaitListService, WaitListUserService, MongooseModule],
})
export class WaitListModule {}
