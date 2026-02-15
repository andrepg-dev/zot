import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class WaitListUserResponseDto {
  @ApiProperty({
    description: "Unique identifier of the waitlist user entry",
    example: "507f1f77bcf86cd799439011",
  })
  _id: string;

  @ApiProperty({
    description: "Email address of the registered user",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Waitlist ID this user belongs to",
    example: "507f1f77bcf86cd799439011",
  })
  waitlistId: string;

  @ApiPropertyOptional({
    description: "Referral code of the user who referred this signup",
    example: "ref_abc123xyz",
  })
  referredBy?: string;

  @ApiProperty({
    description: "Unique referral code for this user to share",
    example: "ref_xyz789abc",
  })
  referral_code: string;

  @ApiProperty({
    description: "Registration timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;
}

export class WaitListUserCountResponseDto {
  @ApiProperty({
    description: "Total number of users in the waitlist",
    example: 1250,
  })
  total: number;

  @ApiProperty({
    description: "Number of users who signed up via referral",
    example: 320,
  })
  referred: number;
}
