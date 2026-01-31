import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JWT } from "@api/src/constants/authentication";
import { JwtClassService } from "./jwt-services.service";

@Module({
  imports: [
    JwtModule.register({
      secret: JWT.SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [JwtClassService],
  exports: [JwtClassService],
})
export class JwtServicesModule {}
