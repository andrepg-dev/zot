import { ReactToHtmlService } from "@api/src/v1/core/react-to-html/react-to-html.service";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModuleV1 } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";
import { EmailTemplatesModule } from "./email-templates/email-templates.module";
import { ReactToHtmlModuleV1 } from "./react-to-html/react-to-html.module";
import { UsersModuleV1 } from "./users/users.module";
import { WaitListModuleV1 } from "./wait-list/wait-list.module";

@Module({
  imports: [
    AuthModuleV1,
    ReactToHtmlModuleV1,
    UsersModuleV1,
    WaitListModuleV1,
    EmailTemplatesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ReactToHtmlService,
  ],
})
export class V1Module {}
