import { User } from "@api/src/users/schemas/users.schema";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import mongoose, { Model } from "mongoose";
import { Profile, Strategy } from "passport-github2";

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      clientID: configService.get<string>("GITHUB_CLIENT_ID") ?? "",
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET") ?? "",
      scope: ["user:email"],
      callbackURL: `${configService.get<string>("BACKEND_URL")}/auth/github/callback`,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: any) => void,
  ) {
    try {
      const { displayName, emails, photos, username } = profile;

      if (!emails || emails.length === 0)
        throw new HttpException(
          "GitHub email not provided",
          HttpStatus.BAD_REQUEST,
        );

      const email = emails[0].value;

      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        // User already exists, update provider if not already included
        const providers = existingUser.providers;

        if (!providers.includes("github")) {
          providers.push("github");
          await this.userModel.findByIdAndUpdate(existingUser._id, {
            provider: providers,
          });
        }

        done(null, { userId: String(existingUser._id) });
        return;
      }

      const nameParts = displayName?.split(" ") ?? [username];
      const firstName = nameParts[0] ?? username;
      const lastName = nameParts.slice(1).join(" ") || undefined;

      const dto = {
        email,
        name: firstName,
        last_name: lastName,
        avatar: photos?.[0]?.value ?? undefined,
      };

      const randomObjectId = String(new mongoose.Types.ObjectId());

      // Save in database
      const document = await this.userModel.create({
        ...dto,
        providers: ["github"],
        username: `${dto.name}${dto.last_name}${randomObjectId}`,
      });

      done(null, { userId: String(document._id) }); // -> envia a github strategy
    } catch (error) {
      done(error as Error);
    }
  }
}
