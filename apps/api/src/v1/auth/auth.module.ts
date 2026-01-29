import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { CookiesService } from "@api/src/common/cookies.service";
import { JWT } from "@api/src/constants/authentication";
import { UsersModuleV1 } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GitHubStrategy } from "./strategies/github.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UsersModuleV1,
    JwtModule.register({
      secret: JWT.SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
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
export class AuthModuleV1 {}
