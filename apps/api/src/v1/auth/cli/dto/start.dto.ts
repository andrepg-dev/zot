import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class StartCliSessionDto {
  @ApiProperty({
    description: "Optional human-readable name of the CLI client requesting access.",
    example: "zot-cli 1.0.0",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientName?: string;
}

export class StartCliSessionResponseDto {
  @ApiProperty({ description: "Opaque device code the CLI uses to poll." })
  deviceCode: string;

  @ApiProperty({ description: "Short human code used as fallback when manual entry is needed." })
  userCode: string;

  @ApiProperty({ description: "Base URL the CLI should open in the user's browser." })
  verificationUri: string;

  @ApiProperty({
    description:
      "Full URL (with session token) the CLI should open. Opens the authorize page directly without manual code entry.",
  })
  verificationUriComplete: string;

  @ApiProperty({ description: "Seconds until the session expires." })
  expiresIn: number;

  @ApiProperty({ description: "Minimum poll interval in seconds." })
  interval: number;
}
