import { ReactToHtmlService } from "@api/src/v1/core/react-to-html/react-to-html.service";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";
import { EmailTemplatesModule } from "./email-templates/email-templates.module";
import { EmailsModule } from "./emails/emails.module";
import { ReactToHtmlModule } from "./react-to-html/react-to-html.module";
import { UsersModule } from "./users/users.module";
import { WaitListModule } from "./wait-list/wait-list.module";
import { EmailSendingService } from "./core/email-sending/email-sending.service";
import { EmailSecurityService } from './core/email-security/email-security.service';

@Module({
  imports: [
    AuthModule,
    ReactToHtmlModule,
    UsersModule,
    WaitListModule,
    EmailTemplatesModule,
    EmailsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ReactToHtmlService,
    EmailSendingService,
    EmailSecurityService,
  ],
})
export class V1Module {}
