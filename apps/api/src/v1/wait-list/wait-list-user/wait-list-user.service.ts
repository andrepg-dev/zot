import { HttpService } from "@api/src/common/http-service/http.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { EmailSecurityService } from "../../core/email-security/email-security.service";
import { EmailSecurity } from "../../core/email-security/schemas/email-security.schema";
import { WaitListUser } from "../schemas/wait-list-user.schema";
import { WaitList } from "../schemas/wait-list.schema";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";

@Injectable()
export class WaitListUserService {
  constructor(
    @InjectModel(WaitListUser.name)
    private WaitListUserModel: Model<WaitListUser>,
    @InjectModel(WaitList.name) private WaitListModel: Model<WaitList>,
    private readonly emailSecurityService: EmailSecurityService,
    @InjectModel(EmailSecurity.name) private EmailSecurityModel: Model<EmailSecurity>,
    private readonly httpService: HttpService,
  ) {}

  private async validateOwnership(
    waitlistId: Types.ObjectId,
    owner: Types.ObjectId,
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
      // const emailValidation = await this.emailSecurityService.verifyEmail(dto.email);
      // if (emailValidation.isBlocked) {
      //   throw new HttpException("Email not allowed.", HttpStatus.BAD_REQUEST);
      // }

      // await this.EmailSecurityModel.create({
      //   ...emailValidation,
      //   waitlistId,
      //   email: dto.email,
      // });

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

      const user = await this.WaitListUserModel.create({
        email: dto.email,
        waitlistId: waitlistId,
        position,
        referredBy: dto.referredBy,
      });

      // Send the webhook to the webhook URL
      /**
       * I need to count the amount of users registered in the waitlist, and if that number is divisible by the range, send the webhook to the webhook url
       */
      if (waitlist.webhook?.url && waitlist.webhook?.range > 0) {
        console.log("Se envía el webhook por un rango de", waitlist.webhook.range, "usuarios");

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

          await this.httpService.post(waitlist.webhook.url, webhookBody).catch(() => {
            console.log("Webhook failed");
          });
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
          $sort: { position: 1 },
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

  async remove(waitlistId: Types.ObjectId, email: string, owner: Types.ObjectId) {
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
