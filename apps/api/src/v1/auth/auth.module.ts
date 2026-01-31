import { Module } from "@nestjs/common";

import { CookiesService } from "@api/src/common/cookies.service";
import { JwtServicesModule } from "@api/src/common/jwt-services/jwt-services.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GitHubStrategy } from "./strategies/github.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [UsersModuleV1, JwtServicesModule],
  controllers: [AuthController],
  providers: [
    CookiesService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,
  ],
})
export class AuthModule {}
