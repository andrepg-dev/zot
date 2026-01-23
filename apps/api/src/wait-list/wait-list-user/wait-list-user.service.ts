import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
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

  private toObjectId(id: string | undefined): Types.ObjectId | undefined {
    return id ? new Types.ObjectId(id) : undefined;
  }

  private async validateOwnership(
    waitlistId: Types.ObjectId,
    owner: string | undefined,
  ): Promise<void> {
    if (!owner) {
      throw new ForbiddenException("You must be authenticated to perform this action.");
    }

    const waitlist = await this.WaitListModel.findOne({
      _id: waitlistId,
      owner: this.toObjectId(owner),
    });

    if (!waitlist) {
      throw new NotFoundException("Waitlist not found or you don't have permission to access it.");
    }
  }

  async register(waitlistId: Types.ObjectId, dto: RegisterWaitListUserDto) {
    try {
      // Validate that the waitlist exists and is available
      const waitlist = await this.WaitListModel.findOne({
        _id: waitlistId,
        is_available: true,
      });

      if (!waitlist) {
        throw new NotFoundException("Waitlist not found or is not available for registration.");
      }

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
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async findAll(waitlistId: Types.ObjectId, owner: string | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      return await this.WaitListUserModel.find({ waitlist_id: waitlistId }).sort({ position: 1 });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async findByEmail(waitlistId: Types.ObjectId, email: string, owner: string | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      const user = await this.WaitListUserModel.findOne({
        waitlist_id: waitlistId,
        email,
      });

      if (!user) {
        throw new NotFoundException(`User with email "${email}" not found in this waitlist.`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async remove(waitlistId: Types.ObjectId, email: string, owner: string | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      const response = await this.WaitListUserModel.findOneAndDelete({
        waitlist_id: waitlistId,
        email,
      });

      if (!response) {
        throw new NotFoundException(`User with email "${email}" not found in this waitlist.`);
      }

      return response;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async count(waitlistId: Types.ObjectId, owner: string | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      return await this.WaitListUserModel.countDocuments({ waitlist_id: waitlistId });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async countReferred(waitlistId: Types.ObjectId, owner: string | undefined) {
    try {
      await this.validateOwnership(waitlistId, owner);

      return await this.WaitListUserModel.countDocuments({
        waitlist_id: waitlistId,
        is_referred: true,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  private handleDatabaseErrors(error: any) {
    console.error(error);
    throw new InternalServerErrorException(`Error saving on database: ${error}`);
  }
}
