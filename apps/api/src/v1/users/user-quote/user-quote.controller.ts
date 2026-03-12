import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Controller, Get, Query } from "@nestjs/common";
import { Types } from "mongoose";
import { QUOTE_SERVICE_KEYS, QuoteServiceKey } from "./types/quote-service-key";
import { UserQuoteService } from "./user-quote.service";

@Controller("user-quote")
export class UserQuoteController {
  constructor(private readonly userQuoteService: UserQuoteService) {}

  @Get()
  findUserQuote(@UserId() userId: Types.ObjectId) {
    return this.userQuoteService.findUserQuote(userId);
  }

  @Get("history")
  getUsageHistory(
    @UserId() userId: Types.ObjectId,
    @Query("service") service?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("limit") limit?: string,
  ) {
    const filters: {
      service?: QuoteServiceKey;
      from?: Date;
      to?: Date;
      limit?: number;
    } = {};

    if (service && QUOTE_SERVICE_KEYS.includes(service as QuoteServiceKey)) {
      filters.service = service as QuoteServiceKey;
    }

    if (from) filters.from = new Date(from);
    if (to) filters.to = new Date(to);
    if (limit) filters.limit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    return this.userQuoteService.getUsageHistory(userId, filters);
  }
}
