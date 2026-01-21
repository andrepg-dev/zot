import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user?.password) {
      throw new InternalServerErrorException("Password not provided");
    }

    const isPasswordLegit = await bcrypt.compare(password, user?.password);

    if (!isPasswordLegit) {
      return null;
    }

    const { password: userPassword, ...rest } = user.toObject();
    return rest;
  }

  async register(user: CreateUserDto) {
    const respose = await this.usersService.create(user, "local");
    return respose;
  }
}
