import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ApproveCliSessionDto {
  @ApiProperty({
    description: "Session token from verificationUriComplete (preferred).",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-f0-9]{64}$/i, { message: "sessionToken must be 64 hex characters" })
  sessionToken?: string;

  @ApiProperty({
    description: "User code. Required when the user typed it in manually instead of following the session URL.",
    required: false,
    example: "AB12-CD34",
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/, {
    message: "userCode must match the format XXXX-XXXX",
  })
  userCode?: string;

  @ApiProperty({
    description: "Name to assign to the generated API key.",
    example: "My laptop CLI",
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  apiKeyName: string;
}

export class DenyCliSessionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-f0-9]{64}$/i)
  sessionToken?: string;

  @ApiProperty({ required: false, example: "AB12-CD34" })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  userCode?: string;
}
