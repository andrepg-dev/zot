import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@ApiTags("Feedback")
@ApiBearerAuth("JWT-auth")
@Controller({ path: "feedback", version: "1" })
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor("images", MAX_FILES, { limits: { fileSize: MAX_FILE_SIZE_BYTES } }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "I would love to see dark mode support." },
        images: {
          type: "array",
          items: { type: "string", format: "binary" },
          description: "Optional screenshots (max 5, 5MB each)",
        },
      },
      required: ["message"],
    },
  })
  @ApiOperation({
    summary: "Submit feedback",
    description:
      "Creates a new feedback entry from the authenticated user. Optionally accepts up to 5 image attachments.",
  })
  @ApiCreatedResponse({ description: "Feedback submitted successfully" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.feedbackService.create(createFeedbackDto, files, userId);
  }
}
