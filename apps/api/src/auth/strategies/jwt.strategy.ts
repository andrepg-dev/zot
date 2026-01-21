import {
  JWT,
  SAVE_ACCESS_TOKEN_IN_COOKIES_KEY,
} from "@api/src/constants/authentication";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Types } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";

export interface JwtPayload {
  userId: Types.ObjectId;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies[SAVE_ACCESS_TOKEN_IN_COOKIES_KEY];
        },
      ]),
      secretOrKey: configService.get<string>(JWT.key) ?? "",
      ignoreExpiration: false,
    });
  }

  validate(payload: any) {
    console.log({ JwtPayload: payload });

    return payload;
  }
}
