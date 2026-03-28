import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { UserQuoteModule } from "./user-quote/user-quote.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UserQuoteModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule, UserQuoteModule],
})
export class UsersModule {}
