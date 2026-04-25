import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { S3Service } from "../core/aws/s3/s3.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { Feedback } from "./schemas/feedback.schema";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
    files: Express.Multer.File[] | undefined,
    owner: Types.ObjectId,
  ) {
    try {
      const images: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const { url } = await this.s3Service.uploadSingleFile({ file });
          const resolved = await url;
          if (resolved.url) images.push(resolved.url);
        }
      }

      return await this.feedbackModel.create({
        message: createFeedbackDto.message,
        images,
        owner,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error creating feedback.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
