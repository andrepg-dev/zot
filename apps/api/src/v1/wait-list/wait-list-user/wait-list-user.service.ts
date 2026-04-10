import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { EmailSecurityService } from "../../core/email-security/email-security.service";
import { UserQuoteService } from "../../users/user-quote/user-quote.service";
import { UsersService } from "../../users/users.service";
import { WaitListUser } from "../schemas/wait-list-user.schema";
import { WaitList } from "../schemas/wait-list.schema";
import { WaitlistWebhookEvent } from "../schemas/waitlist-webhooks-events.schema";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";

@Injectable()
export class WaitListUserService {
  constructor(
    @InjectModel(WaitListUser.name) private WaitListUserModel: Model<WaitListUser>,
    @InjectModel(WaitList.name) private WaitListModel: Model<WaitList>,
    private readonly emailSecurityService: EmailSecurityService,
    @InjectModel(WaitlistWebhookEvent.name) private WaitlistWebhookEventModel: Model<WaitlistWebhookEvent>,
    private readonly httpService: HttpService,
    private readonly userQuoteService: UserQuoteService,
    private readonly usersService: UsersService,
  ) {}

  async validateOwnership(waitlistId: Types.ObjectId, owner: Types.ObjectId): Promise<void> {
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
      // <================== VALIDATE WAITLIST IF EXISTS AND IS AVAILABLE ==================>
      const waitlist = await this.WaitListModel.findOne({
        _id: waitlistId,
        isAvailable: true,
      }).select("+owner");

      if (!waitlist) {
        throw new HttpException(
          "Waitlist not found or is not available for registration.",
          HttpStatus.BAD_REQUEST,
        );
      }

      // <================== VALIDATE IF USER IS ALREADY REGISTERED IN THE WAITLIST ==================>
      const existingUser = await this.WaitListUserModel.findOne({
        waitlistId: waitlistId,
        email: dto.email,
      });

      if (existingUser) {
        throw new HttpException(
          `User with email ${dto.email} is already registered in this waitlist.`,
          HttpStatus.CONFLICT,
        );
      }

      if (waitlist.isSecurityActive) {
        await this.emailSecurityService.blockEmailForPayingUsers({
          email: dto.email,
          waitlistId,
          userId: waitlist.owner,
        });
      }

      // <================== USER QUOTE ===================>
      const hasFreePlan = await this.usersService.hasFreePlan(waitlist.owner);

      if (hasFreePlan) {
        await this.userQuoteService.editUserQuote({
          ownerId: waitlist.owner,
          service: "userSignUp",
          usage: 1,
        });
      }

      const position: number =
        (await this.WaitListUserModel.countDocuments({ waitlistId: waitlistId })) + 1;

      const user = await this.WaitListUserModel.create({
        waitlistId: waitlistId,
        position,
        ...dto,
      });

      // <================== SEND WEBHOOK TO THE WEBHOOK URL ==================>
      /**
       * I need to count the amount of users registered in the waitlist, and if that number is divisible by the range, send the webhook to the webhook url
       */
      if (waitlist.webhook?.url && waitlist.webhook?.range > 0) {
        const usersCount = await this.WaitListUserModel.countDocuments({ waitlistId: waitlistId });

        if (usersCount % waitlist.webhook.range === 0) {
          // Send by range
          const webhookBody: Record<string, any> = {
            email: dto.email,
            event: "waitlist_user_registered",
            waitlist: {
              id: waitlistId.toString(),
              name: waitlist.name,
            },
          };

          if (dto.referredBy) {
            webhookBody.referredBy = dto.referredBy;
          }

          try {
            const response = await firstValueFrom(
              this.httpService.post(waitlist.webhook.url, webhookBody),
            );

            await this.WaitlistWebhookEventModel.create({
              waitlistId,
              event: "waitlist_user_registered",
              url: waitlist.webhook.url,
              payload: webhookBody,
              status: "success",
              responseStatusCode: response.status,
              responseBody: JSON.stringify(response.data ?? null),
              sentAt: new Date(),
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error sending webhook";

            await this.WaitlistWebhookEventModel.create({
              waitlistId,
              event: "waitlist_user_registered",
              url: waitlist.webhook.url,
              payload: webhookBody,
              status: "failed",
              errorMessage,
              sentAt: new Date(),
            }).catch(() => undefined);
          }
        }
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error instanceof Error ? error.message : "Error registering in waitlist.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    waitlistId: Types.ObjectId,
    owner: Types.ObjectId,
    pipeline: mongoose.PipelineStage[] = [],
  ) {
    try {
      await this.validateOwnership(waitlistId, owner);

      const basePipeline: mongoose.PipelineStage[] = [
        {
          $match: { waitlistId },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            waitlistId: 0,
          },
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.WaitListUserModel.aggregate([...basePipeline, ...pipeline]).exec();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching waitlist users.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsersBasedOnOwner(owner: Types.ObjectId, pipeline: mongoose.PipelineStage[] = []) {
    // get all the user waitlist to find all the result based on his wailtist's
    const userWaitlists = await this.WaitListModel.find({ owner }).select("_id");

    const waitlistIds = userWaitlists.map((w) => w._id);

    try {
      const basePipeline: mongoose.PipelineStage[] = [
        {
          $match: { waitlistId: { $in: waitlistIds } },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            waitlistId: 0,
          },
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.WaitListUserModel.aggregate([...basePipeline, ...pipeline]).exec();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching waitlist users.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(waitlistId: Types.ObjectId, email: string, owner: Types.ObjectId) {
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

  async remove(waitlistId: Types.ObjectId, emails: Array<string>, owner: Types.ObjectId) {
    try {
      await this.validateOwnership(waitlistId, owner);

      const response = await this.WaitListUserModel.deleteMany({
        waitlistId,
        email: { $in: emails },
      });

      if (response.deletedCount == 0) {
        throw new HttpException("There is not emails to delete.", HttpStatus.BAD_REQUEST);
      }

      if (!response) {
        throw new HttpException(
          `User with email "${JSON.stringify(Array.isArray(emails) ? emails.join(", ") : emails)}" not found in this waitlist.`,
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

  async count(waitlistId: Types.ObjectId, owner: Types.ObjectId) {
    try {
      await this.validateOwnership(waitlistId, owner);
      return await this.WaitListUserModel.countDocuments({ waitlistId: waitlistId });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error counting waitlist users.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countReferred(waitlistId: Types.ObjectId, owner: Types.ObjectId) {
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
