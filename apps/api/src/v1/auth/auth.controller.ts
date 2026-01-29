import { CookiesService } from "@api/src/common/cookies.service";
import { SAVE_ACCESS_TOKEN_IN_COOKIES_KEY } from "@api/src/constants/authentication";
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import express from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/skip-auth.decorator";
import {
  AccessTokenResponseDto,
  LoginDto,
  LogoutResponseDto,
  UserProfileResponseDto,
} from "./dto/auth-response.dto";
import { GitHubAuthGuard } from "./guards/github.guard";
import { GoogleAuthGuard } from "./guards/google.guard";
import { LocalAuthGuard } from "./guards/local.guard";

@ApiTags("Auth")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private cookiesService: CookiesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiOperation({
    summary: "User login",
    description: "Authenticate user with email and password. Returns JWT access token.",
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: "Successfully authenticated",
    type: AccessTokenResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Invalid credentials" })
  login(@Request() req: express.Request, @Response({ passthrough: true }) res: express.Response) {
    if (!req.user) throw new UnauthorizedException();

    const access_token = this.jwtService.sign(req.user);

    this.cookiesService.saveCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY, access_token);

    return { access_token };
  }

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "User registration",
    description:
      "Create a new user account. Returns JWT access token upon successful registration.",
  })
  @ApiOkResponse({
    description: "User successfully registered",
    type: AccessTokenResponseDto,
  })
  @ApiBadRequestResponse({ description: "User already exists or validation failed" })
  async register(
    @Body() user: CreateUserDto,
    @Request() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    const newUser = await this.authService.register(user);
    if (!newUser) throw new HttpException("User already exists, please login.", 400);

    req.user = { userId: String(newUser._id) };

    const access_token = this.jwtService.sign(req.user);
    this.cookiesService.saveCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY, access_token);

    return { access_token };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("google")
  @ApiOperation({
    summary: "Google OAuth login",
    description: "Initiates Google OAuth2 authentication flow. Redirects to Google login page.",
  })
  google() {}

  @Public()
  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: "Google OAuth callback",
    description: "Handles Google OAuth2 callback after successful authentication.",
  })
  @ApiOkResponse({
    description: "Successfully authenticated via Google",
    type: UserProfileResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: "User not found after OAuth" })
  googleAuthRedirect(
    @Request() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    if (!req.user) throw new InternalServerErrorException("User not found.");

    const access_token = this.jwtService.sign(req.user);
    this.cookiesService.saveCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY, access_token);

    return req.user;
  }

  @Public()
  @Get("github/callback")
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({
    summary: "GitHub OAuth callback",
    description: "Handles GitHub OAuth2 callback after successful authentication.",
  })
  @ApiOkResponse({
    description: "Successfully authenticated via GitHub",
    type: UserProfileResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: "User not found after OAuth" })
  githubAuthRedirect(
    @Request() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    if (!req.user) throw new InternalServerErrorException("User not found.");

    const access_token = this.jwtService.sign(req.user);
    this.cookiesService.saveCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY, access_token);

    return req.user;
  }

  @Public()
  @UseGuards(GitHubAuthGuard)
  @Get("github")
  @ApiOperation({
    summary: "GitHub OAuth login",
    description: "Initiates GitHub OAuth2 authentication flow. Redirects to GitHub login page.",
  })
  github() {}

  @Get("profile")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get current user profile",
    description: "Returns the authenticated user profile information.",
  })
  @ApiOkResponse({
    description: "User profile retrieved successfully",
    type: UserProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  getProfile(@Request() req: express.Request) {
    return req.user;
  }

  @Get("logout")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "User logout",
    description: "Clears authentication cookies and logs out the user.",
  })
  @ApiOkResponse({
    description: "Successfully logged out",
    type: LogoutResponseDto,
  })
  logout(@Response({ passthrough: true }) res: express.Response) {
    this.cookiesService.clearCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY);
    return { message: "Logged out successfully" };
  }
}
