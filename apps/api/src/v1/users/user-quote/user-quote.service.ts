import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserQuote } from "./schemas/user-quote.schema";

@Injectable()
export class UserQuoteService {
  constructor(@InjectModel(UserQuote.name) private userQuoteModel: Model<UserQuote>) {}

  private readonly services: Array<keyof UserQuote> = [
    "userSignUp",
    "waitlist",
    "landingPage",
    "emailsSent",
    "emailsTemplates",
    "domains",
  ];

  async findUserQuote(userId: Types.ObjectId): Promise<UserQuote> {
    try {
      const quote = await this.userQuoteModel.findOne({ owner: userId }).select("+owner");

      if (!quote) {
        throw new NotFoundException("Quote not found");
      }

      return quote.toJSON();
    } catch {
      throw new InternalServerErrorException("Cannot find the <quote> of the user in database");
    }
  }

  async editUserQuote(
    userId: Types.ObjectId,
    update: {
      service: keyof UserQuote;
      decrease: number;
    },
  ) {
    try {
      if (!this.services.includes(update.service)) {
        throw new BadRequestException("Invalid service provided to update user quote");
      }

      if (update.decrease <= 0) {
        throw new BadRequestException("Amount must be greater than 0");
      }

      const quote = await this.userQuoteModel.findOne({ owner: userId }).select("+owner");

      if (!quote) {
        throw new NotFoundException("Quote not found");
      }

      const currentValue = quote[update.service] as number;

      if (currentValue < update.decrease) {
        throw new BadRequestException("Insufficient credits for this service");
      }

      quote[update.service] = (currentValue - update.decrease) as never;

      await quote.save();

      return quote.toJSON();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException("Cannot update the <quote> of the user in database");
    }
  }
}
