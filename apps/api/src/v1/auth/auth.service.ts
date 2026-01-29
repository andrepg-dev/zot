import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = user.toObject();
    return rest;
  }

  async register(user: CreateUserDto) {
    const response = await this.usersService.create(user, ["local"]);
    return response;
  }
}
