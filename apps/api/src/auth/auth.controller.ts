import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/skip-auth.decorator";
import { LocalAuthGuard } from "./guards/local.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req: any, @Response({ passthrough: true }) res: Response) {
    return { access_token: this.jwtService.sign(req.user) };
  }

  @Public()
  @Post("register")
  async register(@Body() user: CreateUserDto) {
    const response = this.authService.register(user);
    return response;
  }
}
