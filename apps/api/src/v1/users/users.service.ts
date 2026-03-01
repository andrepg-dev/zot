import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto, providers: Array<"local" | "google" | "github">) {
    try {
      const userExists = await this.findByEmail(user.email);

      if (userExists !== null) {
        return null;
      }

      const { password, ...rest } = user;

      // generate username
      const username = `${rest.name}${rest.lastName}`;

      const userDocument = new this.userModel({
        ...rest,
        password: bcrypt.hashSync(password, 10),
        username,
        providers,
      });

      return await this.userModel.create(userDocument);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error creating user.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) return null;

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching user by email.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById({ id });

      if (!user) return null;

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching user.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdAndUpdate(id: string, data: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error updating user.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error deleting user.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
