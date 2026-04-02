import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Controller, Get } from "@nestjs/common";
import { Types } from "mongoose";
import { GeneralStatsService } from "./general-stats.service";

@Controller("general-stats")
export class GeneralStatsController {
  constructor(private readonly generalStatsService: GeneralStatsService) {}

  @Get()
  getGeneralStats(@UserId() userId: Types.ObjectId) {
    return this.generalStatsService.getGeneralStats(userId);
  }
}
