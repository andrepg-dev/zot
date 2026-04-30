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

export type PaidPlan = "STARTER" | "PREMIUM";
export type BillingInterval = "monthly" | "yearly";

const PLAN_RANK: Record<"FREE" | PaidPlan, number> = {
  FREE: 0,
  STARTER: 1,
  PREMIUM: 2,
};

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

  getPriceIdForPlan(plan: PaidPlan, interval: BillingInterval = "monthly"): string | undefined {
    const suffix = interval === "yearly" ? "_YEARLY_PRICE_ID" : "_PRICE_ID";
    const key = plan === "STARTER" ? `STRIPE_STARTER${suffix}` : `STRIPE_PREMIUM${suffix}`;
    return this.configService.get<string>(key);
  }

  resolvePlanFromPriceId(priceId: string | undefined): PaidPlan | null {
    if (!priceId) return null;
    const monthlyStarter = this.configService.get<string>("STRIPE_STARTER_PRICE_ID");
    const yearlyStarter = this.configService.get<string>("STRIPE_STARTER_YEARLY_PRICE_ID");
    const monthlyPremium = this.configService.get<string>("STRIPE_PREMIUM_PRICE_ID");
    const yearlyPremium = this.configService.get<string>("STRIPE_PREMIUM_YEARLY_PRICE_ID");
    if (priceId === monthlyStarter || priceId === yearlyStarter) return "STARTER";
    if (priceId === monthlyPremium || priceId === yearlyPremium) return "PREMIUM";
    return null;
  }

  async createCheckoutSession(
    userId: Types.ObjectId,
    plan: PaidPlan,
    interval: BillingInterval = "monthly",
    couponCode?: string,
  ) {
    const priceId = this.getPriceIdForPlan(plan, interval);
    const checkoutSuccessUrl = this.configService.get<string>("STRIPE_CHECKOUT_SUCCESS_URL");
    const checkoutCancelUrl = this.configService.get<string>("STRIPE_CHECKOUT_CANCEL_URL");
    const frontendUrl = this.configService.get<string>("FRONTEND_URL");
    const webhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) throw new InternalServerErrorException("Cannot procces the payment.");

    const successUrl =
      checkoutSuccessUrl ?? `${frontendUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = checkoutCancelUrl ?? `${frontendUrl}/billing/cancel`;

    if (!priceId || !successUrl || !cancelUrl) {
      throw new InternalServerErrorException(
        `Missing Stripe price ID for ${plan} or checkout URLs in environment`,
      );
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const activeStatuses: Array<Stripe.Subscription.Status> = ["active", "trialing", "past_due"];
    const hasActiveSubscription =
      !!user.stripeSubscriptionStatus &&
      activeStatuses.includes(user.stripeSubscriptionStatus as Stripe.Subscription.Status);
    const currentRank = PLAN_RANK[(user.suscriptionPlan as keyof typeof PLAN_RANK) ?? "FREE"] ?? 0;
    const targetRank = PLAN_RANK[plan];

    if (hasActiveSubscription && currentRank >= targetRank) {
      throw new BadRequestException(
        `User already has a ${user.suscriptionPlan} subscription. Cannot subscribe to ${plan}.`,
      );
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      stripeCustomerId = await this.createAndPersistCustomer(user);
    }

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    const effectiveCouponCode = couponCode?.trim();

    if (effectiveCouponCode) {
      const promotionCodes = await this.stripe.promotionCodes.list({
        code: effectiveCouponCode,
        active: true,
        limit: 1,
      });

      const promotionCode = promotionCodes.data[0];
      if (!promotionCode) {
        throw new BadRequestException("Invalid or inactive coupon code");
      }

      discounts = [{ promotion_code: promotionCode.id }];
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: String(user._id),
        requestedPlan: plan,
      },
      subscription_data: {
        metadata: {
          userId: String(user._id),
          plan,
        },
      },
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
    };

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.create(sessionParams);
    } catch (error) {
      // Recover from stale customer IDs (usually when mixing live/test keys).
      if (!this.isMissingStripeCustomerError(error)) {
        throw error;
      }

      stripeCustomerId = await this.createAndPersistCustomer(user);
      session = await this.stripe.checkout.sessions.create({
        ...sessionParams,
        customer: stripeCustomerId,
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
        const metadataPlan = this.normalizePlanMetadata(session.metadata?.requestedPlan);
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : undefined;
        const customerId = typeof session.customer === "string" ? session.customer : undefined;

        if (!subscriptionId) break;

        const { status: subscriptionStatus, plan: planFromPrice } =
          await this.getSubscriptionStatusAndPlan(subscriptionId);
        const plan = planFromPrice ?? metadataPlan;

        if (metadataUserId && Types.ObjectId.isValid(metadataUserId)) {
          await this.usersService.syncStripeSubscription(new Types.ObjectId(metadataUserId), {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: subscriptionStatus,
            plan,
          });
          break;
        }

        if (customerId) {
          const user = await this.usersService.findByStripeCustomerId(customerId);

          if (user) {
            await this.usersService.syncStripeSubscription(user._id, {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripeSubscriptionStatus: subscriptionStatus,
              plan,
            });
          }
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

        const priceId = subscription.items?.data?.[0]?.price?.id;
        const planFromPrice = this.resolvePlanFromPriceId(priceId);
        const metadataPlan = this.normalizePlanMetadata(subscription.metadata?.plan);

        await this.usersService.syncStripeSubscription(user._id, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripeSubscriptionStatus: subscription.status,
          plan: planFromPrice ?? metadataPlan,
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

  private async getSubscriptionStatusAndPlan(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items?.data?.[0]?.price?.id;
      return {
        status: subscription.status,
        plan: this.resolvePlanFromPriceId(priceId),
      };
    } catch {
      return { status: "active" as Stripe.Subscription.Status, plan: null as PaidPlan | null };
    }
  }

  private normalizePlanMetadata(value: string | undefined): PaidPlan | null {
    if (value === "STARTER" || value === "PREMIUM") return value;
    return null;
  }
}
