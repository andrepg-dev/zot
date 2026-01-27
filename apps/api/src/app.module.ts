import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";
import envConfig from "./config/env.config";
import mongodbConfig from "./config/mongodb.config";
import { UsersModule } from "./users/users.module";
import { WaitListModule } from "./wait-list/wait-list.module";
import { ReactToHtmlService } from './core/react-to-html/react-to-html.service';
import { ReactToHtmlModule } from './react-to-html/react-to-html.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    MongooseModule.forRootAsync(mongodbConfig()),
    WaitListModule,
    UsersModule,
    AuthModule,
    ReactToHtmlModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ReactToHtmlService,
  ],
})
export class AppModule {}
