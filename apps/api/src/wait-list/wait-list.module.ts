import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WaitList, WaitListSchema } from "./schemas/wait-list.schema";
import { WaitListController } from "./wait-list.controller";
import { WaitListService } from "./wait-list.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitList.name, schema: WaitListSchema },
    ]),
  ],
  controllers: [WaitListController],
  providers: [WaitListService],
})
export class WaitListModule {}
