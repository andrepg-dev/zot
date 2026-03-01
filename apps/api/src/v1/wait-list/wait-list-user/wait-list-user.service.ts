import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { WaitListUser } from "../schemas/wait-list-user.schema";
import { WaitList } from "../schemas/wait-list.schema";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";

@Injectable()
export class WaitListUserService {
  constructor(
    @InjectModel(WaitListUser.name)
    private WaitListUserModel: Model<WaitListUser>,
    @InjectModel(WaitList.name) private WaitListModel: Model<WaitList>,
  ) {}

  private async validateOwnership(
    waitlistId: Types.ObjectId,
    owner: Types.ObjectId | undefined,
  ): Promise<void> {
    if (!owner) {
      throw new HttpException(
        "You must be authenticated to perform this action.",
        HttpStatus.FORBIDDEN,
      );
    }

    const waitlist = await this.WaitListModel.findOne({
      _id: waitlistId,
      owner,
    });

    if (!waitlist) {
      throw new HttpException("Waitlist not found.", HttpStatus.BAD_REQUEST);
    }
  }

  async register(waitlistId: Types.ObjectId, dto: RegisterWaitListUserDto) {
    try {
      // Validate that the waitlist exists and is available
      const waitlist = await this.WaitListModel.findOne({
        _id: waitlistId,
        isAvailable: true,
      });

      if (!waitlist) {
        throw new HttpException(
          "Waitlist not found or is not available for registration.",
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingUser = await this.WaitListUserModel.findOne({
        waitlistId: waitlistId,
        email: dto.email,
      });

      if (existingUser) {
        throw new HttpException(
          `User with email "${dto.email}" is already registered in this waitlist.`,
          HttpStatus.CONFLICT,
        );
      }

      const position: number =
        (await this.WaitListUserModel.countDocuments({ waitlistId: waitlistId })) + 1;

      return await this.WaitListUserModel.create({
        email: dto.email,
        waitlistId: waitlistId,
        position,
        referredBy: dto.referredBy,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error registering in waitlist.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(waitlistId: Types.ObjectId, owner: Types.ObjectId | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      return await this.WaitListUserModel.find({ waitlistId: waitlistId }).sort({ position: 1 });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching waitlist users.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(waitlistId: Types.ObjectId, email: string, owner: Types.ObjectId | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      const user = await this.WaitListUserModel.findOne({
        waitlistId: waitlistId,
        email,
      });

      if (!user) {
        throw new HttpException(
          `User with email "${email}" not found in this waitlist.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching waitlist user.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(waitlistId: Types.ObjectId, email: string, owner: Types.ObjectId | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      const response = await this.WaitListUserModel.findOneAndDelete({
        waitlistId: waitlistId,
        email,
      });

      if (!response) {
        throw new HttpException(
          `User with email "${email}" not found in this waitlist.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return response;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Error removing user from waitlist.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async count(waitlistId: Types.ObjectId, owner: Types.ObjectId | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);
      return await this.WaitListUserModel.countDocuments({ waitlistId: waitlistId });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error counting waitlist users.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countReferred(waitlistId: Types.ObjectId, owner: Types.ObjectId | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      return await this.WaitListUserModel.countDocuments({
        waitlistId: waitlistId,
        isReferred: true,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Error counting referred users in waitlist.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
