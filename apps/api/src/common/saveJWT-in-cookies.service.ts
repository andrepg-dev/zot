import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { Types } from "mongoose";

import { CookiesService } from "@api/src/common/cookies.service";
import { JwtClassService } from "@api/src/common/jwt-services/jwt-services.service";
import {
  SAVE_ACCESS_TOKEN_IN_COOKIES_KEY,
  SAVE_REFRESH_TOKEN_IN_COOKIES_KEY,
} from "@api/src/constants/authentication";

@Injectable()
export class SaveJWTInCookiesService {
  constructor(
    private readonly jwtService: JwtClassService,
    private readonly cookiesService: CookiesService,
  ) {}

  saveAccessToken(res: Response, params: { userId: Types.ObjectId }) {
    const access_token = this.jwtService.signUser(params);
    this.cookiesService.saveCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY, access_token);
    return access_token;
  }

  saveRefreshToken(res: Response, refreshToken: string) {
    this.cookiesService.saveCookie(res, SAVE_REFRESH_TOKEN_IN_COOKIES_KEY, refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return refreshToken;
  }
}
