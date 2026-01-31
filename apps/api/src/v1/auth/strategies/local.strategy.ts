import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  /**
   * This validate function has his values from the req.body and after that, sent it to the req.user
   *
   * @param email
   * @param password
   * @returns
   */
  async validate(email: string, password: string) {
    const user = await this.authService.login({ email, password });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return { userId: user._id }; // req.user => { userId: ObjecId }
  }
}
