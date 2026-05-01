import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class BulkImportWaitListUserItem {
  @ApiProperty({ example: "user@example.com", format: "email" })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: "Jane Doe" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: { plan: "pro" } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class BulkImportWaitListUsersDto {
  @ApiProperty({ type: [BulkImportWaitListUserItem] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5000)
  @ValidateNested({ each: true })
  @Type(() => BulkImportWaitListUserItem)
  users: BulkImportWaitListUserItem[];
}

export class BulkImportWaitListUsersResponseDto {
  @ApiProperty({ description: "Number of users successfully added" })
  added: number;

  @ApiProperty({ description: "Number of users skipped (already in this waitlist)" })
  skipped: number;

  @ApiProperty({
    description: "Per-row errors: email and reason",
    example: [{ email: "bad-email", reason: "Invalid email" }],
  })
  errors: Array<{ email: string; reason: string }>;
}
