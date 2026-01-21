import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  /**
   * Local authentication
   *
   * @param email
   * @param password
   */
  async login(email: string, password: string) {}
}
