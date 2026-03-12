import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCheckoutSessionDto {
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
