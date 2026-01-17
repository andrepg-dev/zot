import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import envConfig from "./config/env.config";
import mongodbConfig from "./config/mongodb.config";
import { WaitListModule } from "./wait-list/wait-list.module";

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    MongooseModule.forRootAsync(mongodbConfig()),
    WaitListModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
