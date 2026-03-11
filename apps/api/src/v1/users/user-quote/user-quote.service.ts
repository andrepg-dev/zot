import { toObjectId } from "@api/src/common/data-transform/to-object-id";
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

  private readonly freeQuote = {
    userSignUp: 15000,
    waitlist: 3,
    landingPage: 3,
    emailsSent: 100,
    emailsTemplates: 10,
    domains: 0,
  };

  private readonly premiumQuote = {
    userSignUp: 150000,
    waitlist: 30,
    landingPage: 30,
    emailsSent: 10000,
    emailsTemplates: 200,
    domains: 10,
  };

  private readonly services: Array<keyof UserQuote> = [
    "userSignUp",
    "waitlist",
    "landingPage",
    "emailsSent",
    "emailsTemplates",
    "domains",
  ];

  async createFreeUserQuote(ownerId: Types.ObjectId | string) {
    const id = toObjectId(ownerId);
    return this.userQuoteModel.create({
      owner: id,
      ...this.freeQuote,
    });
  }

  async syncQuoteByPlan(ownerId: Types.ObjectId | string, plan: "FREE" | "PREMIUM" | "SCALE") {
    const id = toObjectId(ownerId);

    const quoteTemplate = plan === "PREMIUM" ? this.premiumQuote : this.freeQuote;

    return this.userQuoteModel.findOneAndUpdate(
      { owner: id },
      {
        $set: quoteTemplate,
      },
      { upsert: true, new: true },
    );
  }

  async findUserQuote(userId: Types.ObjectId): Promise<UserQuote> {
    try {
      const ownerId = toObjectId(userId);
      const quote = await this.userQuoteModel.findOne({ owner: ownerId }).select("+owner");

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
        throw new InternalServerErrorException("Amount must be greater than 0");
      }

      const ownerId = toObjectId(userId);
      let quote = await this.userQuoteModel.findOne({ owner: ownerId }).select("+owner");

      if (!quote) {
        quote = await this.createFreeUserQuote(ownerId);
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

      throw new InternalServerErrorException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error?.response ?? "Cannot update the <quote> of the user in database",
      );
    }
  }
}
