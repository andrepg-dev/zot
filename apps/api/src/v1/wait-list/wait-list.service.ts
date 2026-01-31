import { handleDatabaseErrors } from "@api/src/common/error-handling/handle-database-errors";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitListUser } from "./schemas/wait-list-user.schema";
import { WaitList } from "./schemas/wait-list.schema";

@Injectable()
export class WaitListService {
  constructor(
    @InjectModel(WaitList.name) private WaitListModel: Model<WaitList>,
    @InjectModel(WaitListUser.name) private WaitListUserModel: Model<WaitListUser>,
  ) {}

  async create(createWaitListDto: CreateWaitListDto, owner: Types.ObjectId) {
    try {
      return await this.WaitListModel.create({
        ...createWaitListDto,
        owner,
      });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findAll(owner: Types.ObjectId) {
    try {
      return await this.WaitListModel.find({ owner });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findOne(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      const waitlist = await this.WaitListModel.findOne({
        _id: id,
        owner,
      });

      if (!waitlist) {
        throw new NotFoundException(`WaitList "${String(id)}" not found.`);
      }

      return waitlist;
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async update(id: Types.ObjectId, updateWaitListDto: UpdateWaitListDto, owner: Types.ObjectId) {
    try {
      const waitlist = await this.WaitListModel.findOneAndUpdate(
        { _id: id, owner },
        updateWaitListDto,
        { new: true },
      );

      if (!waitlist) {
        throw new NotFoundException(
          `WaitList "${String(id)}" not found or you don't have permission to update it.`,
        );
      }

      return waitlist;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      handleDatabaseErrors(error);
    }
  }

  async remove(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      // Delete all the users related to this wait-list
      const waitlist = await this.WaitListModel.findOneAndDelete({
        _id: id,
        owner,
      });

      // Get all the user related to this waitlist id
      const users = await this.WaitListUserModel.deleteMany({ waitlist_id: id });

      if (!waitlist) {
        throw new NotFoundException(`WaitList ${id.toString()} not found.`);
      }

      return { response: waitlist, users };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      handleDatabaseErrors(error);
    }
  }
}
