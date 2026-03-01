import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
}
