import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { WaitListUser } from "../schemas/wait-list-user.schema";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";

@Injectable()
export class WaitListUserService {
  constructor(
    @InjectModel(WaitListUser.name)
    private WaitListUserModel: Model<WaitListUser>,
  ) {}

  async register(waitlistId: Types.ObjectId, dto: RegisterWaitListUserDto) {
    try {
      const existingUser = await this.WaitListUserModel.findOne({
        waitlist_id: waitlistId,
        email: dto.email,
      });

      if (existingUser) {
        throw new ConflictException(
          `User with email "${dto.email}" is already registered in this waitlist.`,
        );
      }

      const position =
        (await this.WaitListUserModel.countDocuments({ waitlist_id: waitlistId })) + 1;

      return await this.WaitListUserModel.create({
        email: dto.email,
        waitlist_id: waitlistId,
        referred_by: dto.referred_by,
        position,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async findAll(waitlistId: Types.ObjectId) {
    try {
      return await this.WaitListUserModel.find({ waitlist_id: waitlistId }).sort({ position: 1 });
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  async findByEmail(waitlistId: Types.ObjectId, email: string) {
    try {
      const user = await this.WaitListUserModel.findOne({
        waitlist_id: waitlistId,
        email,
      });

      if (!user) {
        throw new NotFoundException(`User with email "${email}" not found in this waitlist.`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async remove(waitlistId: Types.ObjectId, email: string) {
    try {
      const response = await this.WaitListUserModel.findOneAndDelete({
        waitlist_id: waitlistId,
        email,
      });

      if (!response) {
        throw new NotFoundException(`User with email "${email}" not found in this waitlist.`);
      }

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async count(waitlistId: Types.ObjectId) {
    try {
      return await this.WaitListUserModel.countDocuments({ waitlist_id: waitlistId });
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  async countReferred(waitlistId: Types.ObjectId) {
    try {
      return await this.WaitListUserModel.countDocuments({
        waitlist_id: waitlistId,
        is_referred: true,
      });
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  private handleDatabaseErrors(error: any) {
    console.error(error);
    throw new InternalServerErrorException(`Error saving on database: ${error}`);
  }
}
