import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-custom";

const API_KEY_PREFIX = "Api-Key ";

function validateAuthentication(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith(API_KEY_PREFIX)) {
    throw new UnauthorizedException("Invalid API key");
  }

  const apiKey = authHeader.slice(API_KEY_PREFIX.length).trim();

  if (!apiKey) {
    throw new UnauthorizedException("Invalid API key");
  }

  // validate in the database here
}

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
  validate(req: Request) {
    if (!req.user) {
      throw new InternalServerErrorException(
        "UserID is not provided in this endpoint using API KEY.",
      );
    }

    validateAuthentication(req);

    // If this is verified, then we sent the user as response
    return req.user;
  }
}
