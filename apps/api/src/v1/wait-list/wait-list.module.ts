import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailSecurityService } from "../core/email-security/email-security.service";
import {
  EmailSecurity,
  EmailSecuritySchema,
} from "../core/email-security/schemas/email-security.schema";
import { WaitListUser, WaitListUserSchema } from "./schemas/wait-list-user.schema";
import { WaitList, WaitListSchema } from "./schemas/wait-list.schema";
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
    ]),
    StatsModule,
  ],
  controllers: [WaitListController, WaitListUserController],
  providers: [WaitListService, WaitListUserService, EmailSecurityService],
  exports: [WaitListService, WaitListUserService],
})
export class WaitListModule {}
