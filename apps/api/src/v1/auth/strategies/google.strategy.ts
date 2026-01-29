import { User } from "@api/src/v1/users/schemas/users.schema";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import mongoose, { Model } from "mongoose";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID") ?? "",
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET") ?? "",
      scope: ["email", "profile"],
      callbackURL: `${configService.get<string>("BACKEND_URL")}/v1/auth/google/callback`,
    });
  }

  async validate(_: string, __: string, profile: Profile, done: VerifyCallback) {
    try {
      const { name, emails, photos } = profile;

      if (!emails) throw new HttpException("Google email not provided", HttpStatus.BAD_REQUEST);

      if (!name) throw new HttpException("Google name not provided", HttpStatus.BAD_REQUEST);

      const email = emails[0].value;

      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        // User already exists, update provider if not already included
        const providers = existingUser.providers;

        if (!providers.includes("google")) {
          providers.push("google");
          await this.userModel.findByIdAndUpdate(existingUser._id, {
            provider: providers,
          });
        }

        done(null, { userId: String(existingUser._id) });
        return;
      }

      const dto = {
        email,
        name: name.givenName,
        last_name: name.familyName,
        avatar: photos?.[0].value ?? undefined,
      };

      const randomObjectId = String(new mongoose.Types.ObjectId());

      // Save in database
      const document = await this.userModel.create({
        ...dto,
        providers: ["google"],
        username: `${dto.name}${dto.last_name}${randomObjectId}`,
      });

      done(null, { userId: String(document._id) }); // -> envia a google straty
    } catch (error) {
      done(error as Error);
    }
  }
}
