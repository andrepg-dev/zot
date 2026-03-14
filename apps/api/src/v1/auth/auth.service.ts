import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model, Types } from "mongoose";

import { CookiesService } from "@api/src/common/cookies.service";
import { toObjectId } from "@api/src/common/data-transform/to-object-id";
import { JwtClassService } from "@api/src/common/jwt-services/jwt-services.service";
import { SAVE_REFRESH_TOKEN_IN_COOKIES_KEY } from "@api/src/constants/authentication";
import { Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { UsersService } from "../users/users.service";
import { RefreshToken } from "./schemas/refresh-token.schema";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtClassService: JwtClassService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly cookiesService: CookiesService,
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.usersService.findByEmailWithPassword(userDto.email);

    if (!user) {
      throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
    }

    if (!user?.password) {
      throw new HttpException("Password not provided", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const isPasswordLegit = await bcrypt.compare(userDto.password, user?.password);

    if (!isPasswordLegit) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = user.toObject();
    return rest;
  }

  async register(user: CreateUserDto): Promise<{ _id: Types.ObjectId }> {
    const response = await this.usersService.create(user, ["local"]);

    if (!response) {
      throw new HttpException("User already exists.", HttpStatus.BAD_REQUEST);
    }

    return { _id: response._id };
  }

  async profile(user: Types.ObjectId) {
    const userProfile = await this.usersService.findById(user);

    if (!userProfile) {
      throw new NotFoundException("User not found");
    }

    return userProfile;
  }

  /**
   * This method create an refresh token and save it into the database and the cookies
   *
   * @param res
   * @param userId
   * @returns
   */
  async createRefreshToken(res: Response, userId: Types.ObjectId) {
    const refresh_token = this.jwtClassService.signUser({ userId }, { expiresIn: "7d" });

    this.cookiesService.saveCookie(res, SAVE_REFRESH_TOKEN_IN_COOKIES_KEY, refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    try {
      await this.refreshTokenModel.create({
        owner: userId,
        refresh_token: bcrypt.hashSync(refresh_token, 10),
      });
    } catch {
      throw new InternalServerErrorException("Cannot create refresh token.");
    }

    return refresh_token;
  }

  /**
   * Validate is a refresh token is valid by using .verifyToken method and finding a result in the database
   *
   * @param refresh_token
   * @returns
   */
  async ValidateRefreshToken(
    refresh_token: string | undefined,
  ): Promise<{ userId: Types.ObjectId }> {
    if (!refresh_token) {
      throw new UnauthorizedException("Refresh token not provided");
    }

    const payload = this.jwtClassService.verifyToken<{ userId: string }>(refresh_token);
    if (!payload) throw new BadRequestException("JWT Invalid.");

    const tokens = await this.refreshTokenModel
      .find({ owner: toObjectId(payload.userId) })
      .sort({ createdAt: -1 });

    let isValid = false;
    for (const tokenDoc of tokens) {
      // if the user doesn't have a refresh token into the database, this will be an error
      if (await bcrypt.compare(refresh_token, tokenDoc.refresh_token)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      throw new UnauthorizedException("refresh token invalid");
    }

    return { userId: toObjectId(payload.userId) };
  }
}
