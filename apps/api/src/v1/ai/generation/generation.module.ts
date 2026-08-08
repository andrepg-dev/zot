import { S3Service } from "@api/src/v1/core/aws/s3/s3.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationTitleAgent } from "./conversation-title.agent";
import { EmailIconCatalogService } from "./email-icon-catalog.service";
import { EmailVariantRetentionService } from "./email-variant-retention.service";
import { GenerationController } from "./generation.controller";
import { GenerationEmailsService } from "./generation-emails.service";
import { GenerationQuotaService } from "./generation-quota.service";
import { GenerationService } from "./generation.service";
import { ReactToHtmlService } from "./react-to-html.service";
import { BrandProfile, BrandProfileSchema } from "./schemas/brand-profile.schema";
import { EmailChatMessage, EmailChatMessageSchema } from "./schemas/email-chat-message.schema";
import {
  GenerationEmailVariant,
  GenerationEmailVariantSchema,
} from "./schemas/email-variant.schema";
import { EmailVfsSnapshot, EmailVfsSnapshotSchema } from "./schemas/email-vfs-snapshot.schema";
import { GenerationEmail, GenerationEmailSchema } from "./schemas/generation-email.schema";
import { GenerationRun, GenerationRunSchema } from "./schemas/generation-run.schema";
import { ScreenshotService } from "./screenshot.service";
import { WebsiteBrandService } from "./website-brand.service";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: GenerationEmail.name, schema: GenerationEmailSchema },
      { name: GenerationEmailVariant.name, schema: GenerationEmailVariantSchema },
      { name: EmailChatMessage.name, schema: EmailChatMessageSchema },
      { name: GenerationRun.name, schema: GenerationRunSchema },
      { name: BrandProfile.name, schema: BrandProfileSchema },
      { name: EmailVfsSnapshot.name, schema: EmailVfsSnapshotSchema },
    ]),
  ],
  controllers: [GenerationController],
  providers: [
    GenerationService,
    GenerationEmailsService,
    GenerationQuotaService,
    ReactToHtmlService,
    ScreenshotService,
    WebsiteBrandService,
    ConversationTitleAgent,
    EmailVariantRetentionService,
    EmailIconCatalogService,
    S3Service,
  ],
  exports: [GenerationService, GenerationEmailsService],
})
export class GenerationModule {}
