import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WaitList, WaitListSchema } from "../schemas/wait-list.schema";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: WaitList.name, schema: WaitListSchema }])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
