import { toObjectId } from "@api/src/common/data-transform/to-object-id";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "../schemas/users.schema";
import { QuoteUsageHistory } from "./schemas/quote-usage-history.schema";
import { DomainsQuote, UserQuote } from "./schemas/user-quote.schema";
import { QUOTE_SERVICE_KEYS, QuoteServiceKey } from "./types/quote-service-key";

export type { QuoteServiceKey };

@Injectable()
export class UserQuoteService {
  constructor(
    @InjectModel(UserQuote.name) private userQuoteModel: Model<UserQuote>,
    @InjectModel(QuoteUsageHistory.name) private quoteUsageHistoryModel: Model<QuoteUsageHistory>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  public readonly quote = {
    userSignUp: 0,
    waitlist: 0,
    landingPage: 0,
    emailsSent: 0,
    emailsTemplates: 0,
    domains: { email: 0, general: 0 },
  };

  public readonly freeQuoteLimit = {
    userSignUp: 15000,
    waitlist: 3,
    landingPage: 3,
    emailsSent: 100,
    emailsTemplates: 10,
    domains: { email: 0, general: 0 },
  };

  public readonly premiumQuoteLimit = {
    userSignUp: 1500000,
    waitlist: 30,
    landingPage: 30,
    emailsSent: 10000,
    emailsTemplates: 200,
    domains: { email: 10, general: 10000 },
  };

  /** Normalize domains from DB (supports legacy number or object). */
  private normalizeDomains(domains: DomainsQuote | number | undefined): DomainsQuote {
    if (domains == null) return { email: 0, general: 0 };
    if (typeof domains === "number") return { email: 0, general: domains };
    return {
      email: typeof domains.email === "number" ? domains.email : 0,
      general: typeof domains.general === "number" ? domains.general : 0,
    };
  }

  async createQuote(ownerId: Types.ObjectId | string) {
    const id = toObjectId(ownerId);
    return this.userQuoteModel.create({
      owner: id,
      ...this.quote,
    });
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

  /**
   * Increase user usage
   */
  async editUserQuote({
    ownerId,
    service,
    usage,
  }: {
    ownerId: Types.ObjectId;
    service: QuoteServiceKey;
    usage: number;
  }) {
    try {
      if (!QUOTE_SERVICE_KEYS.includes(service)) {
        throw new BadRequestException("Invalid service provided to update user quote");
      }

      if (usage <= 0) {
        throw new InternalServerErrorException("Amount must be greater than 0");
      }

      const user = await this.userModel.findById(ownerId);
      const userPlan = user?.suscriptionPlan;

      let quote = await this.userQuoteModel.findOne({ owner: ownerId }).select("+owner");

      if (!quote) {
        quote = (await this.createQuote(ownerId)) as typeof quote & object;
      }

      const isNested = service === "domains.email" || service === "domains.general";
      let currentServiceValue: number;

      if (isNested) {
        const domains = this.normalizeDomains(quote.domains);
        currentServiceValue = service === "domains.email" ? domains.email : domains.general;
      } else {
        currentServiceValue = quote[service];
      }

      let serviceLimit: number;

      if (isNested) {
        const subKey = service === "domains.email" ? "email" : "general";
        serviceLimit =
          userPlan === "PREMIUM"
            ? this.premiumQuoteLimit.domains[subKey]
            : this.freeQuoteLimit.domains[subKey];
      } else {
        serviceLimit =
          userPlan === "PREMIUM" ? this.premiumQuoteLimit[service] : this.freeQuoteLimit[service];
      }

      if (currentServiceValue + usage > serviceLimit) {
        throw new BadRequestException(`Limits reached for ${service} service`);
      }

      const usageValue = currentServiceValue + usage;

      if (isNested) {
        const domains = this.normalizeDomains(quote.domains);
        quote.domains = {
          ...domains,
          [service === "domains.email" ? "email" : "general"]: usageValue,
        };
      } else {
        (quote as unknown as Record<string, number>)[service] = usageValue;
      }

      await quote.save();

      // <================== SAVE IN USER QUOTE HISTORY ==================>
      const dontSaveInHistoryUsage = ["userSignUp", "waitlist"];

      // Allow only services available
      if (!dontSaveInHistoryUsage.includes(service)) {
        void this.quoteUsageHistoryModel.create({
          owner: ownerId,
          service,
          amount: usage,
          remainingAfter: serviceLimit - usageValue,
        });
      }

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

  async getUsageHistory(
    ownerId: Types.ObjectId,
    filters?: {
      service?: QuoteServiceKey;
      from?: Date;
      to?: Date;
      limit?: number;
    },
  ) {
    try {
      const matchStage: Record<string, unknown> = { owner: ownerId };

      if (filters?.service) {
        matchStage.service = filters.service;
      }

      if (filters?.from || filters?.to) {
        const dateFilter: Record<string, Date> = {};
        if (filters.from) dateFilter.$gte = filters.from;
        if (filters.to) dateFilter.$lte = filters.to;
        matchStage.createdAt = dateFilter;
      }

      const limit = filters?.limit ?? 50;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.quoteUsageHistoryModel.aggregate([
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $limit: limit },
        {
          $group: {
            _id: "$service",
            totalUsed: { $sum: "$amount" },
            entries: {
              $push: {
                amount: "$amount",
                remainingAfter: "$remainingAfter",
                createdAt: "$createdAt",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            service: "$_id",
            totalUsed: 1,
            entries: 1,
          },
        },
        { $sort: { service: 1 } },
      ]);
    } catch {
      throw new InternalServerErrorException("Cannot retrieve usage history");
    }
  }
}
