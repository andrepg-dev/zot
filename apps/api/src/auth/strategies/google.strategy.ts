import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID") ?? "",
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET") ?? "",
      scope: ["email", "profile"],
      callbackURL: "http://localhost:3010/google/auth/callback",
    });
  }

  validate(_: string, __: string, profile: Profile, done: VerifyCallback) {
    const { name, emails, photos } = profile;

    if (!emails)
      throw new HttpException(
        "Google email not provided",
        HttpStatus.BAD_REQUEST,
      );

    if (!name)
      throw new HttpException(
        "Google name not provided",
        HttpStatus.BAD_REQUEST,
      );

    const user = {
      email: emails[0].value,
      name: name.givenName,
      last_name: name.familyName,
      avatar: photos?.[0].value ?? undefined,
    };

    done(null, user);
  }
}
