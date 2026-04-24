import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class PollCliSessionDto {
  @ApiProperty({ description: "Device code returned by POST /auth/cli/start." })
  @IsString()
  @Matches(/^[a-f0-9]{64}$/i, { message: "deviceCode must be 64 hex characters" })
  deviceCode: string;
}

export class PollCliSessionResponseDto {
  @ApiProperty({
    description:
      "Session status. 'approved' means apiKey is present. 'authorization_pending' and 'slow_down' mean keep polling.",
    enum: ["authorization_pending", "slow_down", "approved", "access_denied", "expired_token"],
  })
  status: "authorization_pending" | "slow_down" | "approved" | "access_denied" | "expired_token";

  @ApiProperty({
    description: "The issued API key, only returned once on the first 'approved' poll.",
    required: false,
  })
  apiKey?: string;

  @ApiProperty({ description: "Interval hint for the next poll, in seconds.", required: false })
  interval?: number;
}
