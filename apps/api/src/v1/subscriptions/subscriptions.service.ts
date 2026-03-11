import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";
import Stripe from "stripe";
import { UsersService } from "../users/users.service";

@Injectable()
export class SubscriptionsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY") as string;

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover",
    });
  }

  async createPremiumCheckoutSession(userId: Types.ObjectId, couponCode?: string) {
    const premiumPriceId = this.configService.get<string>("STRIPE_PREMIUM_PRICE_ID");
    const frontendUrl = this.configService.get<string>("FRONTEND_URL");

    if (!premiumPriceId || !frontendUrl) {
      throw new InternalServerErrorException(
        "Missing STRIPE_PREMIUM_PRICE_ID or FRONTEND_URL in environment",
      );
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      stripeCustomerId = await this.createAndPersistCustomer(user);
    }

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;

    if (couponCode) {
      const promotionCodes = await this.stripe.promotionCodes.list({
        code: couponCode,
        active: true,
        limit: 1,
      });

      const promotionCode = promotionCodes.data[0];
      if (!promotionCode) {
        throw new BadRequestException("Invalid or inactive coupon code");
      }

      discounts = [{ promotion_code: promotionCode.id }];
    }

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        allow_promotion_codes: true,
        line_items: [
          {
            price: premiumPriceId,
            quantity: 1,
          },
        ],
        success_url: `${frontendUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/billing/cancel`,
        metadata: {
          userId: String(user._id),
          requestedPlan: "PREMIUM",
        },
        subscription_data: {
          metadata: {
            userId: String(user._id),
            plan: "PREMIUM",
          },
        },
        discounts,
      });
    } catch (error) {
      // Recover from stale customer IDs (usually when mixing live/test keys).
      if (!this.isMissingStripeCustomerError(error)) {
        throw error;
      }

      stripeCustomerId = await this.createAndPersistCustomer(user);
      session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        allow_promotion_codes: true,
        line_items: [
          {
            price: premiumPriceId,
            quantity: 1,
          },
        ],
        success_url: `${frontendUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/billing/cancel`,
        metadata: {
          userId: String(user._id),
          requestedPlan: "PREMIUM",
        },
        subscription_data: {
          metadata: {
            userId: String(user._id),
            plan: "PREMIUM",
          },
        },
        discounts,
      });
    }

    if (!session.url) {
      throw new InternalServerErrorException("Stripe did not return a checkout URL");
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async handleWebhook(signature: string | undefined, rawBody: Buffer | undefined) {
    const webhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");

    if (!signature || !rawBody || !webhookSecret) {
      throw new InternalServerErrorException("Stripe webhook cannot be verified");
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException("Invalid Stripe webhook signature");
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadataUserId = session.metadata?.userId;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : undefined;
        const customerId = typeof session.customer === "string" ? session.customer : undefined;

        if (metadataUserId && subscriptionId && Types.ObjectId.isValid(metadataUserId)) {
          await this.usersService.syncStripeSubscription(new Types.ObjectId(metadataUserId), {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: "active",
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : undefined;

        if (!customerId) break;

        const user = await this.usersService.findByStripeCustomerId(customerId);
        if (!user) break;

        await this.usersService.syncStripeSubscription(user._id, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripeSubscriptionStatus: subscription.status,
        });
        break;
      }
      default:
        break;
    }

    return { received: true };
  }

  private async createAndPersistCustomer(user: {
    _id: Types.ObjectId;
    email: string;
    name?: string;
    lastName?: string;
  }) {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.name ?? ""} ${user.lastName ?? ""}`.trim() || undefined,
      metadata: {
        userId: String(user._id),
      },
    });

    await this.usersService.setStripeCustomerId(user._id, customer.id);
    return customer.id;
  }

  private isMissingStripeCustomerError(
    error: unknown,
  ): error is Stripe.errors.StripeInvalidRequestError {
    return (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === "resource_missing" &&
      error.param === "customer"
    );
  }
}
