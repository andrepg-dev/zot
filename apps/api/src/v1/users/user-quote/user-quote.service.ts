import { toObjectId } from "@api/src/common/data-transform/to-object-id";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DomainsQuote, UserQuote } from "./schemas/user-quote.schema";

/** Keys that can be decreased: flat counters + nested domains.email and domains.general */
export type QuoteServiceKey =
  | "userSignUp"
  | "waitlist"
  | "landingPage"
  | "emailsSent"
  | "emailsTemplates"
  | "domains.email"
  | "domains.general";

const QUOTE_SERVICE_KEYS: QuoteServiceKey[] = [
  "userSignUp",
  "waitlist",
  "landingPage",
  "emailsSent",
  "emailsTemplates",
  "domains.email",
  "domains.general",
];

@Injectable()
export class UserQuoteService {
  constructor(@InjectModel(UserQuote.name) private userQuoteModel: Model<UserQuote>) {}

  private readonly freeQuote = {
    userSignUp: 15000,
    waitlist: 3,
    landingPage: 3,
    emailsSent: 100,
    emailsTemplates: 10,
    domains: { email: 0, general: 0 },
  };

  private readonly premiumQuote = {
    userSignUp: 1500000,
    waitlist: 30,
    landingPage: 30,
    emailsSent: 10000,
    emailsTemplates: 200,
    domains: { email: 10, general: 10000 },
  };

  private getDomainField(service: QuoteServiceKey): keyof DomainsQuote | null {
    if (service === "domains.email") return "email";
    if (service === "domains.general") return "general";
    return null;
  }

  /** Normalize domains from DB (supports legacy number or object). */
  private normalizeDomains(domains: DomainsQuote | number | undefined): DomainsQuote {
    if (domains == null) return { email: 0, general: 0 };
    if (typeof domains === "number") return { email: 0, general: domains };
    return {
      email: typeof domains.email === "number" ? domains.email : 0,
      general: typeof domains.general === "number" ? domains.general : 0,
    };
  }

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
      service: QuoteServiceKey;
      decrease: number;
    },
  ) {
    try {
      if (!QUOTE_SERVICE_KEYS.includes(update.service)) {
        throw new BadRequestException("Invalid service provided to update user quote");
      }

      if (update.decrease <= 0) {
        throw new InternalServerErrorException("Amount must be greater than 0");
      }

      const ownerId = toObjectId(userId);
      let quote = await this.userQuoteModel.findOne({ owner: ownerId }).select("+owner");

      if (!quote) {
        quote = (await this.createFreeUserQuote(ownerId)) as typeof quote & object;
      }

      const domainField = this.getDomainField(update.service);
      const normalizedDomains = domainField ? this.normalizeDomains(quote.domains) : null;

      const currentValue = normalizedDomains
        ? normalizedDomains[domainField!]
        : (quote[update.service] as number);

      if (currentValue < update.decrease) {
        throw new BadRequestException("Insufficient credits for this service");
      }

      const newValue = currentValue - update.decrease;

      if (normalizedDomains && domainField) {
        quote.domains = { ...normalizedDomains, [domainField]: newValue };
      } else {
        (quote as unknown as Record<string, number>)[update.service] = newValue;
      }

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
