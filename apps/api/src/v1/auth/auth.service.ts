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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = user.toObject();
    return rest;
  }

  async register(user: CreateUserDto): Promise<{ _id: string } | null> {
    const unsafeResponse: unknown = await this.usersService.create(user, ["local"]);

    if (!unsafeResponse) {
      return null;
    }

    const response = unsafeResponse as { _id: unknown };

    return { _id: String(response._id) };
  }
}
