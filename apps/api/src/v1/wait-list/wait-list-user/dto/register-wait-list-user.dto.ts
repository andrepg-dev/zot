import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class RegisterWaitListUserDto {
  @ApiProperty({
    description: "Email address of the user joining the waitlist",
    example: "user@example.com",
    format: "email",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "Referral code from another user who referred this signup",
    example: "ref_abc123xyz",
  })
  @IsOptional()
  @IsString()
  referredBy?: string;
}
