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
      const user = await this.userModel.findOne({ email });

      if (user) {
        console.log("Tenemos al usuario: ", user);

        // User already exists, update provider if not already included
        const providers = user.providers;

        if (!providers.includes("google")) {
          await this.userModel.findByIdAndUpdate(user._id, {
            $push: {
              providers: "google",
            },
          });
        }
        return done(null, { userId: user._id });
      }

      const dto = {
        email,
        name: name.givenName,
        lastName: name.familyName,
        avatar: photos?.[0].value ?? undefined,
      };

      const randomObjectId = String(new mongoose.Types.ObjectId());

      // Save in database
      const document = await this.userModel.create({
        ...dto,
        providers: ["google"],
        username: `${dto.name}${dto.lastName}${randomObjectId}`,
      });

      return done(null, { userId: document._id }); // -> envia a google strategy;
    } catch (error) {
      done(error as Error);
    }
  }
}
