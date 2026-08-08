import { ReactToHtmlService } from "@api/src/v1/core/react-to-html/react-to-html.service";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { GenerationModule } from "./ai/generation/generation.module";
import { AiServerConnectionModule } from "./ai/react-code-email/react-code-email.module";
import { ApiKeyModule } from "./api-key/api-key.module";
import { AuthModule } from "./auth/auth.module";
import { ApiKeyGuard } from "./auth/guards/api-key.guard";
import { CompositeAuthGuard } from "./auth/guards/composite-auth.guard";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";
import { S3Service } from "./core/aws/s3/s3.service";
import { EmailSendingService } from "./core/email-sending/email-sending.service";
import { EmailTemplatesModule } from "./email-templates/email-templates.module";
import { EmailsModule } from "./emails/emails.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { GeneralStatsModule } from "./general-stats/general-stats.module";
import { GeneralStatsService } from "./general-stats/general-stats.service";
import { ReactToHtmlModule } from "./react-to-html/react-to-html.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { UsersModule } from "./users/users.module";
import { WaitListModule } from "./wait-list/wait-list.module";

@Module({
  imports: [
    AuthModule,
    ReactToHtmlModule,
    SubscriptionsModule,
    UsersModule,
    WaitListModule,
    EmailTemplatesModule,
    EmailsModule,
    ApiKeyModule,
    AiServerConnectionModule,
    GenerationModule,
    GeneralStatsModule,
    FeedbackModule,
  ],
  providers: [
    JwtAuthGuard,
    ApiKeyGuard,
    {
      provide: APP_GUARD,
      useClass: CompositeAuthGuard,
    },
    ReactToHtmlService,
    EmailSendingService,
    GeneralStatsService,
    S3Service,
  ],
})
export class V1Module {}
