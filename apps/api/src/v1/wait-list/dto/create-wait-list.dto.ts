import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from "class-validator";

export class WebhookConfigDto {
  @ApiPropertyOptional({
    description: "Webhook URL to notify when a new user signs up",
    example: "https://your-server.com/webhooks/waitlist",
    format: "uri",
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description: "Notify webhook every N users registered",
    example: 10,
    default: 10,
  })
  @IsInt()
  @Min(1)
  range: number;
}

export class CreateWaitListDto {
  @ApiProperty({
    description: "Name of the waitlist",
    example: "Product Launch Waitlist",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Whether to send confirmation email to new signups",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  sendEmailToNewSignup?: boolean;

  @ApiPropertyOptional({
    description: "Webhook configuration for new signup notifications",
    type: WebhookConfigDto,
  })
  @ValidateNested()
  @Type(() => WebhookConfigDto)
  @IsOptional()
  webhook?: WebhookConfigDto;

  @ApiPropertyOptional({
    description: "Associated widget ID for embedding",
    example: "507f1f77bcf86cd799439011",
  })
  @IsMongoId({ message: "Invalid mongoDB ObjectId" })
  @IsString()
  @IsOptional()
  widget_id?: string;

  @ApiPropertyOptional({
    description: "Whether the waitlist is accepting new signups",
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: "Whether the waitlist has security active",
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSecurityActive?: boolean;
}
