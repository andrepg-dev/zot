import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model, Types } from "mongoose";

import { toObjectId } from "@api/src/common/data-transform/to-object-id";
import { JwtClassService } from "@api/src/common/jwt-services/jwt-services.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { UsersService } from "../users/users.service";
import { RefreshToken } from "./schemas/refresh_token.schema";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtClassService: JwtClassService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
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

  async createRefreshToken(userId: Types.ObjectId): Promise<string> {
    const refreshToken = this.jwtClassService.signUser({ userId }, { expiresIn: "7d" });

    await this.refreshTokenModel.create({
      refresh_token: refreshToken,
      user: userId,
    });

    return refreshToken;
  }

  async refresh_token(refreshToken: string | undefined): Promise<{ userId: Types.ObjectId }> {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not provided");
    }

    let payload: { userId: string };

    try {
      payload = this.jwtClassService.verifyToken<{ userId: string }>(refreshToken);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const userId = toObjectId(payload.userId);

    const storedToken = await this.refreshTokenModel.findOne({
      refresh_token: refreshToken,
      user: userId,
    });

    if (!storedToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    return { userId };
  }
}
