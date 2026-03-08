import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import envConfig from "./config/env.config";
import mongodbConfig from "./config/mongodb.config";
import { HttpServiceModule } from "./common/http-service/http-service.module";
import { V1Module } from "./v1/app.module";

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    MongooseModule.forRootAsync(mongodbConfig()),
    HttpServiceModule,
    V1Module,
  ],
  controllers: [AppController],
})
export class AppModule {}
