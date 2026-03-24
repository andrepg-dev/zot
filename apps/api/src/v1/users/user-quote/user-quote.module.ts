import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/users.schema";
import { QuoteUsageHistory, QuoteUsageHistorySchema } from "./schemas/quote-usage-history.schema";
import { UserQuote, UserQuoteSchema } from "./schemas/user-quote.schema";
import { UserQuoteController } from "./user-quote.controller";
import { UserQuoteService } from "./user-quote.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserQuote.name, schema: UserQuoteSchema },
      { name: QuoteUsageHistory.name, schema: QuoteUsageHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserQuoteController],
  providers: [UserQuoteService],
  exports: [UserQuoteService],
})
export class UserQuoteModule {}
