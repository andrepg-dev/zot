import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIn, IsObject, IsOptional, IsString } from "class-validator";
import {
  WAITLIST_USER_SELECTABLE_SOURCES,
  type WaitListUserSelectableSource,
} from "../../schemas/wait-list-user.schema";

export class RegisterWaitListUserDto {
  @ApiProperty({
    description: "Email address of the user joining the waitlist",
    example: "user@example.com",
    format: "email",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "Name of the user joining the waitlist",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Referral code from another user who referred this signup",
    example: "ref_abc123xyz",
  })
  @IsOptional()
  @IsString()
  referredBy?: string;

  @ApiPropertyOptional({
    description: "Source channel of the signup (organic and referral are auto-determined)",
    enum: WAITLIST_USER_SELECTABLE_SOURCES,
    example: "social",
  })
  @IsOptional()
  @IsIn(WAITLIST_USER_SELECTABLE_SOURCES)
  source?: WaitListUserSelectableSource;

  @ApiPropertyOptional({
    description: "Arbitrary key-value metadata to attach to the waitlist user",
    example: { plan: "pro" },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
