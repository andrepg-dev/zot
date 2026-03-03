import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { UserQuote, UserQuoteSchema } from "./user-quote/schemas/user-quote.schema";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserQuote.name, schema: UserQuoteSchema },
    ]),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
