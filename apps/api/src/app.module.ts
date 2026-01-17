import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import envConfig from "./config/env.config";
import mongodbConfig from "./config/mongodb.config";
import { WaitListModule } from "./wait-list/wait-list.module";
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    MongooseModule.forRootAsync(mongodbConfig()),
    WaitListModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
