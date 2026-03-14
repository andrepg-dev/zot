import { User } from "@api/src/v1/users/schemas/users.schema";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "../../users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly usersService: UsersService,
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

      const existingUser = await this.usersService.findByEmail(email);

      if (existingUser) {
        const providers = existingUser.providers;

        if (!providers.includes("google")) {
          await this.userModel.findByIdAndUpdate(existingUser._id, {
            $push: {
              providers: "google",
            },
          });
        }
        return done(null, { userId: existingUser._id });
      }

      const dto = {
        email,
        name: name.givenName,
        lastName: name.familyName,
        avatar: photos?.[0].value ?? undefined,
      } as CreateUserDto;

      const document = await this.usersService.create(dto, ["google"]);

      return done(null, { userId: document!._id });
    } catch (error) {
      done(error as Error);
    }
  }
}
