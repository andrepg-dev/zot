import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Types } from "mongoose";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(userDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(userDto.email);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (!user?.password) {
      throw new InternalServerErrorException("Password not provided");
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
      throw new BadRequestException("User already exists.");
    }

    return { _id: response._id };
  }
}
