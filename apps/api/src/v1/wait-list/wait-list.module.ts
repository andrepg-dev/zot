import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WaitListUser, WaitListUserSchema } from "./schemas/wait-list-user.schema";
import { WaitList, WaitListSchema } from "./schemas/wait-list.schema";
import { WaitListUserController } from "./wait-list-user/wait-list-user.controller";
import { WaitListUserService } from "./wait-list-user/wait-list-user.service";
import { WaitListController } from "./wait-list.controller";
import { WaitListService } from "./wait-list.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitList.name, schema: WaitListSchema },
      { name: WaitListUser.name, schema: WaitListUserSchema },
    ]),
  ],
  controllers: [WaitListController, WaitListUserController],
  providers: [WaitListService, WaitListUserService],
})
export class WaitListModuleV1 {}
