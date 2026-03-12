import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Model, Types } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/users.schema";
import { UserQuoteService } from "./user-quote/user-quote.service";

type StripeSubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userQuoteService: UserQuoteService,
  ) {}

  async create(user: CreateUserDto, providers: Array<"local" | "google" | "github">) {
    try {
      const userExists = await this.findByEmail(user.email);

      if (userExists !== null) {
        return null;
      }

      const { password, ...rest } = user;

      // generate username
      const randomUuid = randomUUID();
      const username = `${rest.name}${rest.lastName}${randomUuid}`;

      const userDocument = new this.userModel({
        ...rest,
        password: bcrypt.hashSync(password, 10),
        username,
        providers,
      });

      const userQuote = await this.userQuoteService.createFreeUserQuote(userDocument._id);

      userDocument.quote = userQuote._id;

      return await userDocument.save();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(`Error creating user. ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) return null;

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching user by email.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmailWithPassword(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).select("+password");

      if (!user) return null;

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching user by email.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id).populate("quote");

      if (!user) return null;

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(`Error fetching user. ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdAndUpdate(id: string, data: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error updating user.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error deleting user.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByStripeCustomerId(customerId: string) {
    try {
      return await this.userModel.findOne({ stripeCustomerId: customerId });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Error fetching user by Stripe customer.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setStripeCustomerId(userId: Types.ObjectId, stripeCustomerId: string) {
    try {
      return await this.userModel.findByIdAndUpdate(
        userId,
        { stripeCustomerId },
        {
          new: true,
        },
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error saving Stripe customer id.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async syncStripeSubscription(
    userId: Types.ObjectId,
    data: {
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
      stripeSubscriptionStatus: StripeSubscriptionStatus;
    },
  ) {
    try {
      const suscriptionPlan =
        data.stripeSubscriptionStatus === "active" ||
        data.stripeSubscriptionStatus === "trialing" ||
        data.stripeSubscriptionStatus === "past_due"
          ? "PREMIUM"
          : "FREE";

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          ...data,
          suscriptionPlan,
        },
        { new: true },
      );

      await this.userQuoteService.syncQuoteByPlan(userId, suscriptionPlan);

      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Error syncing user Stripe subscription.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isPayingUser(userId: Types.ObjectId) {
    const user = await this.findById(userId);
    return user?.suscriptionPlan !== "FREE";
  }
}
