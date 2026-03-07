import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Controller, Get, Param } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { StatsService } from "./stats.service";

@ApiTags("WaitList")
@ApiBearerAuth("JWT-auth")
@Controller({ path: "wait-list", version: "1" })
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(":waitlistId/stats")
  @ApiOperation({
    summary: "Get waitlist statistics",
    description:
      "Retrieves aggregated statistics for a specific waitlist owned by the authenticated user.",
  })
  @ApiParam({
    name: "waitlistId",
    description: "Waitlist MongoDB ObjectId",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({
    description: "Waitlist statistics retrieved successfully",
  })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async waitlistStats(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return this.statsService.getWaitListStats(waitlistId, userId);
  }
}
