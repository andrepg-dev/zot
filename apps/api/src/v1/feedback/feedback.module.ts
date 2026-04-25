import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { S3Service } from "../core/aws/s3/s3.service";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";
import { Feedback, FeedbackSchema } from "./schemas/feedback.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }])],
  controllers: [FeedbackController],
  providers: [FeedbackService, S3Service],
  exports: [FeedbackService],
})
export class FeedbackModule {}
