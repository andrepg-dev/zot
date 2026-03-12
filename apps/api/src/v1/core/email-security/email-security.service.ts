import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import DymoAPI from "dymo-api";
import { Model, Types } from "mongoose";
import { UsersService } from "../../users/users.service";
import { EmailSecurity } from "./schemas/email-security.schema";

@Injectable()
export class EmailSecurityService {
  private readonly dymoClient: DymoAPI;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(EmailSecurity.name) private EmailSecurityModel: Model<EmailSecurity>,
    private readonly usersService: UsersService,
  ) {
    const dymoApiKey = this.configService.getOrThrow<string>("DYMO_API_KEY");

    this.dymoClient = new DymoAPI({
      apiKey: dymoApiKey,
      rules: {
        email: {
          deny: ["FRAUD", "INVALID", "NO_REPLY_EMAIL"],
        },
      },
    });
  }

  async verifyEmail(email: string): Promise<{ isBlocked: boolean; reasons: string[] }> {
    if (!email) {
      throw new HttpException("Email is required.", HttpStatus.BAD_REQUEST);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decision = await this.dymoClient.isValidEmail(email);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!decision?.allow) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return { isBlocked: true, reasons: decision?.reasons as string[] };
      }

      return { isBlocked: false, reasons: [] };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Error verifying email. ${(error as Error)?.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async blockEmailForPayingUsers({
    email,
    waitlistId,
    userId,
  }: {
    email: string;
    waitlistId: Types.ObjectId;
    userId: Types.ObjectId;
  }) {
    const userPlan = await this.usersService.findById(userId);
    if (!userPlan) {
      throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
    }

    if (userPlan?.suscriptionPlan === "FREE") {
      throw new HttpException(
        "You need to upgrade to a paying plan to use this feature or disable the security feature in your waitlist settings.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailSecurity = await this.EmailSecurityModel.findOne({
      waitlistId,
      email,
    });

    if (emailSecurity?.isBlocked) {
      throw new HttpException(
        `Email not allowed. ${emailSecurity.reasons.join(", ")}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailValidation = await this.verifyEmail(email);

    if (emailValidation.isBlocked) {
      await this.EmailSecurityModel.create({
        ...emailValidation,
        waitlistId,
        email,
      });

      throw new HttpException(
        `Email not allowed. ${emailValidation.reasons.join(", ")}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
