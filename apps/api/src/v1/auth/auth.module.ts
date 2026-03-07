import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CookiesService } from "@api/src/common/cookies.service";
import { JwtServicesModule } from "@api/src/common/jwt-services/jwt-services.module";
import { SaveJWTInCookiesService } from "@api/src/common/saveJWT-in-cookies.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshToken, RefreshTokenSchema } from "./schemas/refresh_token.schema";
import { GitHubStrategy } from "./strategies/github.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UsersModule,
    JwtServicesModule,
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    CookiesService,
    SaveJWTInCookiesService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,
  ],
})
export class AuthModule {}
