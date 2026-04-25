import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export const PAID_PLANS = ["STARTER", "PREMIUM"] as const;
export type PaidPlanName = (typeof PAID_PLANS)[number];

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: "Plan to subscribe to.",
    enum: PAID_PLANS,
    example: "PREMIUM",
  })
  @IsIn([...PAID_PLANS])
  plan: PaidPlanName;

  @ApiPropertyOptional({
    description:
      "Optional promotion code to apply immediately. If omitted, Stripe Checkout still allows entering a code manually.",
    example: "WELCOME10",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  couponCode?: string;
}
