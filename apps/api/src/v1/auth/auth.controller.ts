import { CookiesService } from "@api/src/common/cookies.service";
import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { JwtClassService } from "@api/src/common/jwt-services/jwt-services.service";
import { SAVE_ACCESS_TOKEN_IN_COOKIES_KEY } from "@api/src/constants/authentication";
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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
import mongoose, { Types } from "mongoose";
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
    private jwtService: JwtClassService,
    private cookiesService: CookiesService,
    private configService: ConfigService,
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
  login(@UserId() userId: Types.ObjectId, @Response({ passthrough: true }) res: express.Response) {
    const access_token = this.jwtService.signUser({ userId });
    this.cookiesService.saveCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY, access_token);

    return { success: true, message: "Logged succesfully" };
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

    // Inserting user into the request, we need to insert a string into the jwtService at the moment to convert
    req.user = { userId: newUser._id };
    /**
     * En las cookies, guardo el valor de una manera diferente.
     *
     * Las cookies y el JWT.Sign son diferentes, cosa que me ha costado diferenciar.
     *
     * jwtService => Genera el JWT mediante un string
     *
     * CookiesService => Guarda ese JWT
     *
     * Nosotros lo que tenemos que hacer, es:
     * Convertir ese string guardado, y convertirlo a Types.ObjectId
     *
     * Guardo el token de dos maneras diferentes: en las cookies de usuario y en la request
     */

    const access_token = this.jwtService.signUser({ userId: newUser._id });
    this.cookiesService.saveCookie(res, SAVE_ACCESS_TOKEN_IN_COOKIES_KEY, access_token);

    return { success: true, message: "Registration succesfully" };
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
    description: "Handles Google OAuth2 callback. Sets cookie and redirects to frontend.",
  })
  @ApiInternalServerErrorResponse({ description: "User not found after OAuth" })
  googleAuthRedirect(@Request() req: express.Request, @Response() res: express.Response) {
    if (!req.user) throw new InternalServerErrorException("User not found.");

    const access_token = this.jwtService.signUser(req.user);
    const frontendUrl = this.configService.get<string>("FRONTEND_URL");
    // Redirigir al frontend con el token para que lo guarde en cookies de su dominio.
    // La cookie seteada aquí sería del dominio del API y no es visible en el frontend.
    return res.redirect(`${frontendUrl}/api/auth/callback?access_token=${encodeURIComponent(access_token)}`);
  }

  @Public()
  @Get("github/callback")
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({
    summary: "GitHub OAuth callback",
    description: "Handles GitHub OAuth2 callback. Sets cookie and redirects to frontend.",
  })
  @ApiInternalServerErrorResponse({ description: "User not found after OAuth" })
  githubAuthRedirect(@UserId() userId: Types.ObjectId, @Response() res: express.Response) {
    const access_token = this.jwtService.signUser({ userId });
    const frontendUrl = this.configService.get<string>("FRONTEND_URL");
    return res.redirect(`${frontendUrl}/api/auth/callback?access_token=${encodeURIComponent(access_token)}`);
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
  async getProfile(@UserId() userId: string) {
    return await this.authService.profile(new mongoose.Types.ObjectId(userId)); // { userId: new ObjectId(""), exp: 324234, iat: 3982 }
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
