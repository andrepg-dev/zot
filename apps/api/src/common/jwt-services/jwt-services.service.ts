import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { Types } from "mongoose";

@Injectable()
export class JwtClassService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   *
   * Here we transform from ObjectId to string for sign and send to the Cookies Store
   *
   * @param userObject
   * @param options
   * @returns
   */
  signUser(param: { userId: Types.ObjectId }, options?: JwtSignOptions): string {
    return this.jwtService.sign({ userId: param.userId.toString() }, options);
  }
}
