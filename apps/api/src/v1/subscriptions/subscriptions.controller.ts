import { UserId } from "@api/src/common/decorators/user-id.decorator";
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import type { Request } from "express";
import { Types } from "mongoose";
import { Public } from "../auth/decorators/skip-auth.decorator";
import { CreateCheckoutSessionDto } from "./dto/create-checkout-session.dto";
import {
  CheckoutSessionResponseDto,
  WebhookAcceptedResponseDto,
} from "./dto/subscription-response.dto";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("Subscriptions")
@Controller({ path: "subscriptions", version: "1" })
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post("checkout-session")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Create Stripe checkout session for a paid Zot plan",
    description:
      "Creates a Stripe-hosted checkout session for the current user. Pass plan: STARTER or PREMIUM.",
  })
  @ApiOkResponse({
    description: "Checkout session created successfully",
    type: CheckoutSessionResponseDto,
  })
  @ApiBody({ type: CreateCheckoutSessionDto })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  @ApiInternalServerErrorResponse({ description: "Stripe error while creating session" })
  async createCheckoutSession(
    @UserId() userId: Types.ObjectId,
    @Body() body: CreateCheckoutSessionDto,
  ) {
    return this.subscriptionsService.createCheckoutSession(userId, body.plan, body.couponCode);
  }

  @Public()
  @Post("webhook")
  @HttpCode(200)
  @ApiOperation({
    summary: "Stripe webhook receiver",
    description: "Receives Stripe events and keeps user plan and quotes synchronized.",
  })
  @ApiOkResponse({
    description: "Webhook accepted",
    type: WebhookAcceptedResponseDto,
  })
  async stripeWebhook(
    @Headers("stripe-signature") signature: string | undefined,
    @Req() request: Request,
  ) {
    if (!signature) {
      throw new UnauthorizedException("Missing stripe-signature header");
    }

    return this.subscriptionsService.handleWebhook(signature, request.rawBody);
  }
}
