import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>("GITHUB_CLIENT_ID") ?? "",
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET") ?? "",
      scope: ["user:email"],
      callbackURL: "http://localhost:3010/auth/github/callback",
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: any) => void,
  ) {
    const { displayName, emails, photos, username } = profile;

    if (!emails || emails.length === 0)
      throw new HttpException(
        "GitHub email not provided",
        HttpStatus.BAD_REQUEST,
      );

    // GitHub puede no proporcionar nombre separado, usamos displayName o username
    const nameParts = displayName?.split(" ") ?? [username];
    const firstName = nameParts[0] ?? username;
    const lastName = nameParts.slice(1).join(" ") || undefined;

    const user = {
      email: emails[0].value,
      name: firstName,
      last_name: lastName,
      avatar: photos?.[0]?.value ?? undefined,
    };

    done(null, user);
  }
}
