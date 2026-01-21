import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto) {
    return this.userModel.create(user);
  }

  async findByEmail(email: string) {
    const user = this.userModel.findOne({ email });

    if (!user) throw new NotFoundException();

    return user;
  }

  async findById(id: string) {
    const user = this.userModel.findById({ id });

    if (!user) throw new NotFoundException();

    return user;
  }

  async findByIdAndUpdate(id: string, data: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findByIdAndDelete(id: string) {
    return this.userModel.findByIdAndDelete(id, { new: true });
  }
}
