import { handleDatabaseErrors } from "@api/src/common/error-handling/handle-database-errors";
import { Injectable } from "@nestjs/common";
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
      const username = `${rest.name}${rest.last_name}`;

      const userDocument = new this.userModel({
        ...rest,
        password: bcrypt.hashSync(password, 10),
        username,
        providers,
      });

      return await this.userModel.create(userDocument);
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) return null;

      return user;
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById({ id });

      if (!user) return null;

      return user;
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findByIdAndUpdate(id: string, data: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }
}
