import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import express from "express";
import { CookiesService } from "../common/cookies.service";
import { SAVE_ACCESS_TOKEN_IN_COOKIES_KEY } from "../constants/authentication";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/skip-auth.decorator";
import { GitHubAuthGuard } from "./guards/github.guard";
import { GoogleAuthGuard } from "./guards/google.guard";
import { LocalAuthGuard } from "./guards/local.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private cookiesService: CookiesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(
    @Request() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    if (!req.user) throw new UnauthorizedException();

    const access_token = this.jwtService.sign(req.user);

    this.cookiesService.saveCookie(
      res,
      SAVE_ACCESS_TOKEN_IN_COOKIES_KEY,
      access_token,
    );

    return { access_token };
  }

  @Public()
  @Post("register")
  async register(
    @Body() user: CreateUserDto,
    @Request() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    const newUser = await this.authService.register(user);
    if (!newUser)
      throw new HttpException("User already exists, please login.", 400);

    req.user = { userId: String(newUser._id) };

    const access_token = this.jwtService.sign(req.user);
    this.cookiesService.saveCookie(
      res,
      SAVE_ACCESS_TOKEN_IN_COOKIES_KEY,
      access_token,
    );

    return { access_token };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google")
  google() {}

  @Public()
  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(
    @Request() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    if (!req.user) throw new InternalServerErrorException("User not found.");

    const access_token = this.jwtService.sign(req.user);
    this.cookiesService.saveCookie(
      res,
      SAVE_ACCESS_TOKEN_IN_COOKIES_KEY,
      access_token,
    );

    return req.user;
  }

  @Public()
  @Get("github/callback")
  @UseGuards(GitHubAuthGuard)
  githubAuthRedirect(
    @Request() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    if (!req.user) throw new InternalServerErrorException("User not found.");

    const access_token = this.jwtService.sign(req.user);
    this.cookiesService.saveCookie(
      res,
      SAVE_ACCESS_TOKEN_IN_COOKIES_KEY,
      access_token,
    );

    return req.user;
  }

  @Public()
  @UseGuards(GitHubAuthGuard)
  @Get("github")
  github() {}

  @Get("profile")
  getProfile(@Request() req: express.Request) {
    return req.user;
  }
}
