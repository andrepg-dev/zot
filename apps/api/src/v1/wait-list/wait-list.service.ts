import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error creating waitlist.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(owner: Types.ObjectId) {
    try {
      return this.WaitListModel.aggregate([
        {
          $match: { owner },
        },
        {
          $lookup: {
            from: "waitlistusers",
            foreignField: "waitlistId",
            as: "usersPopulate",
            localField: "_id",
          },
        },
        {
          $addFields: {
            users: {
              organic: {
                $size: {
                  $filter: {
                    input: "$usersPopulate",
                    as: "u",
                    cond: { $eq: [{ $ifNull: ["$$u.referredBy", null] }, null] },
                  },
                },
              },
              referred: {
                $size: {
                  $filter: {
                    input: "$usersPopulate",
                    as: "u",
                    cond: { $ne: [{ $ifNull: ["$$u.referredBy", null] }, null] },
                  },
                },
              },
              total: { $size: "$usersPopulate" },
            },
          },
        },
        {
          $project: {
            usersPopulate: 0,
            owner: 0,
          },
        },
      ]);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching waitlists.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: Types.ObjectId, owner: Types.ObjectId) {
    const waitlist = await this.WaitListModel.findOne({
      _id: id,
      owner,
    });

    if (!waitlist) {
      throw new HttpException(
        `WaitList "${String(id)}" not found or you don't have permission to access it.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return waitlist;
  }

  async update(id: Types.ObjectId, updateWaitListDto: UpdateWaitListDto, owner: Types.ObjectId) {
    try {
      const waitlist = await this.WaitListModel.findOneAndUpdate(
        { _id: id, owner },
        updateWaitListDto,
        { new: true },
      );

      if (!waitlist) {
        throw new HttpException(
          `WaitList ${id.toString()} not found or you don't have permission to update it.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return waitlist;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error updating waitlist.", HttpStatus.INTERNAL_SERVER_ERROR);
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
      const users = await this.WaitListUserModel.deleteMany({ waitlistId: id });

      if (!waitlist) {
        throw new HttpException(
          `WaitList ${id.toString()} not found or you don't have permission to delete it.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return { response: waitlist, users };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error deleting waitlist.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
