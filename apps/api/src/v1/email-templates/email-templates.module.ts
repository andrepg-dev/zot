import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReactToHtmlService } from "../core/react-to-html/react-to-html.service";
import { UserQuoteModule } from "../users/user-quote/user-quote.module";
import { EmailTemplatesController } from "./email-templates.controller";
import { EmailTemplatesService } from "./email-templates.service";
import { EmailTemplate, EmailTemplateSchema } from "./schemas/email-template.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EmailTemplate.name, schema: EmailTemplateSchema }]),
    UserQuoteModule,
  ],
  providers: [EmailTemplatesService, ReactToHtmlService],
  controllers: [EmailTemplatesController],
})
export class EmailTemplatesModule {}
