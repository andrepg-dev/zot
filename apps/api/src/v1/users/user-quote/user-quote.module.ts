import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserQuote, UserQuoteSchema } from "./schemas/user-quote.schema";
import { UserQuoteService } from "./user-quote.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: UserQuote.name, schema: UserQuoteSchema }])],
  controllers: [],
  providers: [UserQuoteService],
  exports: [UserQuoteService],
})
export class UserQuoteModule {}
