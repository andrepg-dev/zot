import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_IN_REQUEST_KEY,
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
          return req?.cookies[ACCESS_TOKEN_IN_REQUEST_KEY];
        },
      ]),
      secretOrKey: configService.get<string>(ACCESS_TOKEN.key) ?? "",
      ignoreExpiration: false,
    });
  }

  validate(payload: {}) {
    // Extract the payload values

    return payload;
  }
}
