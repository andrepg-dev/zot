import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { EmailSecurityService } from "../../core/email-security/email-security.service";
import { EmailSendingService } from "../../core/email-sending/email-sending.service";
import { EmailTemplate } from "../../email-templates/schemas/email-template.schema";
import { EmailSendRecord } from "../../emails/schemas/email-send-record.schema";
import { EmailParams } from "../../types/email-sending";
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
    @InjectModel(WaitlistWebhookEvent.name)
    private WaitlistWebhookEventModel: Model<WaitlistWebhookEvent>,
    private readonly httpService: HttpService,
    private readonly userQuoteService: UserQuoteService,
    private readonly usersService: UsersService,
    @InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>,
    private readonly emailService: EmailSendingService,
    @InjectModel(EmailSendRecord.name)
    private readonly emailSendRecordModel: Model<EmailSendRecord>,
    private readonly userquoteService: UserQuoteService,
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
      await this.userQuoteService.editUserQuote({
        ownerId: waitlist.owner,
        service: "userSignUp",
        usage: 1,
      });

      const lastUser = await this.WaitListUserModel.findOne({ waitlistId: waitlistId })
        .sort({ position: -1 })
        .select("position")
        .lean();

      const position = lastUser?.position ?? 0 + 1;
      const source = dto.referredBy ? "referral" : dto.source || "organic";

      const user = await this.WaitListUserModel.create({
        ...dto,
        waitlistId,
        position,
        source,
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

      // <================== SEND EMAIL TO NEW SIGN-UP ==================>
      if (waitlist.sendEmailToNewSignup === true && waitlist.emailTemplateToNewSignUps) {
        const template = await this.EmailTemplateModel.findOne({
          _id: waitlist.emailTemplateToNewSignUps,
        });

        if (!template) {
          throw new NotFoundException("Default email not found, please provide one.");
        }

        const payload: EmailParams = {
          from: "Zot WaitList <mail@zot.so>",
          to: dto.email,
          provider: "resend",
          subject: template.subject,
          options: {
            html: template.html,
            replyTo: "mail@zot.so",
          },
        };

        const { to: _, provider, ...rest } = payload;

        try {
          await this.emailService.send(payload);

          this.emailSendRecordModel.create({
            owner: waitlist.owner,
            waitlistId,
            quantitySent: 1,
            recipientEmails: [user.email],
            sentSuccessfully: 1,
            failedCount: 0,
            failedEmails: [],
            payload: rest,
          });

          await this.userquoteService.editUserQuote({
            ownerId: waitlist.owner,
            service: "emailsSent",
            usage: 1,
          });
        } catch (err) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if ((err as any)?.status != 500) {
            // If the problem is from the server, should not be in the user quote
            await this.userquoteService.editUserQuote({
              ownerId: waitlist.owner,
              service: "emailsSent",
              usage: 1,
            });
          }

          await this.emailSendRecordModel.create({
            owner: waitlist.owner,
            waitlistId,
            quantitySent: 1,
            recipientEmails: [user.email],
            sentSuccessfully: 0,
            failedCount: 1,
            failedEmails: [user.email],
            payload: rest,
          });

          throw err;
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

  async updateStatus(
    waitlistId: Types.ObjectId,
    email: string,
    status: string,
    owner: Types.ObjectId,
  ) {
    try {
      await this.validateOwnership(waitlistId, owner);

      const user = await this.WaitListUserModel.findOneAndUpdate(
        { waitlistId, email },
        { $set: { status } },
        { new: true },
      );

      if (!user) {
        throw new HttpException(
          `User with email "${email}" not found in this waitlist.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error updating user status.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
