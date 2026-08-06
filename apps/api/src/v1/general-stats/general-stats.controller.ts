import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { Types } from "mongoose";
import { GeneralStatsService } from "./general-stats.service";

@Controller("general-stats")
export class GeneralStatsController {
  constructor(private readonly generalStatsService: GeneralStatsService) {}

  @Get()
  @ApiQuery({
    name: "from",
    required: false,
    description: "Start date (ISO 8601)",
    example: "2026-03-01",
  })
  @ApiQuery({
    name: "to",
    required: false,
    description: "End date (ISO 8601)",
    example: "2026-04-01",
  })
  getDashboardStats(
    @UserId() userId: Types.ObjectId,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return this.generalStatsService.getDashboardStats(userId, from, to);
  }
}
