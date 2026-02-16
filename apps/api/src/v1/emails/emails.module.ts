import { RESEND } from "@api/src/constants/resend";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ResendModule } from "nestjs-resend";
import { EmailSendingService } from "../core/email-sending/email-sending.service";
import { EmailsController } from "./emails.controller";
import { EmailsService } from "./emails.service";
import { EmailSchema } from "./schemas/email.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EmailsService.name, schema: EmailSchema }]),
    ResendModule.forRoot({ apiKey: RESEND.API_KEY }),
  ],
  controllers: [EmailsController],
  providers: [EmailsService, EmailSendingService],
})
export class EmailsModule {}
