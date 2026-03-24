import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserQuoteService } from "../users/user-quote/user-quote.service";
import { UsersService } from "../users/users.service";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitListUser } from "./schemas/wait-list-user.schema";
import { WaitList } from "./schemas/wait-list.schema";
import { WaitlistWebhookEvent } from "./schemas/waitlist-webhooks-events.schema";

@Injectable()
export class WaitListService {
  constructor(
    @InjectModel(WaitList.name) private WaitListModel: Model<WaitList>,
    @InjectModel(WaitListUser.name) private WaitListUserModel: Model<WaitListUser>,
    @InjectModel(WaitlistWebhookEvent.name)
    private WaitlistWebhookEventModel: Model<WaitlistWebhookEvent>,
    private readonly usersService: UsersService,
    private readonly userQuoteService: UserQuoteService,
  ) {}

  async create(createWaitListDto: CreateWaitListDto, owner: Types.ObjectId) {
    try {
      const hasFreePlan = await this.usersService.hasFreePlan(owner);

      if (hasFreePlan && createWaitListDto.isSecurityActive) {
        throw new HttpException(
          "You need to upgrade to a paying plan to use this feature or disable the security feature in your waitlist settings.",
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.userQuoteService.editUserQuote({
        ownerId: owner,
        service: "waitlist",
        usage: 1,
      });

      const document = await this.WaitListModel.create({
        ...createWaitListDto,
        owner,
      });

      return document;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error creating waitlist.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(owner: Types.ObjectId) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.WaitListModel.aggregate([
        {
          $match: { owner },
        },
        {
          $lookup: {
            from: "waitlistusers",
            localField: "_id",
            foreignField: "waitlistId",
            as: "usersPopulate",
          },
        },
        {
          $lookup: {
            from: "emailsendrecords",
            localField: "_id",
            foreignField: "waitlistId",
            as: "emailsSentPopulate",
          },
        },
        {
          $lookup: {
            from: "emailsecurities",
            localField: "_id",
            foreignField: "waitlistId",
            as: "emailSecurity",
            pipeline: [
              {
                $project: {
                  waitlistId: 0,
                  _id: 0,
                  createdAt: 0,
                  isBlocked: 0,
                  reasons: 0,
                },
              },
            ],
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
            emailsSent: {
              $sum: "$emailsSentPopulate.quantitySent",
            },
            usersBlocked: {
              $size: "$emailSecurity",
            },
          },
        },
        {
          $project: {
            usersPopulate: 0,
            owner: 0,
            emailsSentPopulate: 0,
            emailSecurity: 0,
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
      const hasFreePlan = await this.usersService.hasFreePlan(owner);

      if (hasFreePlan && updateWaitListDto.isSecurityActive) {
        throw new HttpException(
          "You need to upgrade to a paying plan to use this feature or disable the security feature in your waitlist settings.",
          HttpStatus.BAD_REQUEST,
        );
      }

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

  async findWebhookEvents(waitlistId: Types.ObjectId, owner: Types.ObjectId) {
    try {
      const waitlist = await this.WaitListModel.findOne({
        _id: waitlistId,
        owner,
      });

      if (!waitlist) {
        throw new HttpException(
          `WaitList "${String(waitlistId)}" not found or you don't have permission to access it.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.WaitlistWebhookEventModel.find({ waitlistId })
        .select("+waitlistId")
        .sort({ sentAt: -1 })
        .lean();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching webhook events.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
