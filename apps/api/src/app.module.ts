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
import { WidgetModule } from "./widget/widget.module";

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    MongooseModule.forRootAsync(mongodbConfig()),
    WaitListModule,
    UsersModule,
    AuthModule,
    WidgetModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
