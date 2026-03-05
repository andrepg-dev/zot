import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { UserQuoteModule } from "./user-quote/user-quote.module";
import { UsersService } from "./users.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UserQuoteModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
