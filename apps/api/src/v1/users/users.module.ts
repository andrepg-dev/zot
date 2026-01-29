import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { UsersService } from "./users.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModuleV1 {}
