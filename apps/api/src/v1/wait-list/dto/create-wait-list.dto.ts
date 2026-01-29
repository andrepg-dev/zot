import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

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
  send_email_to_new_signup: boolean;

  @ApiPropertyOptional({
    description: "Webhook URL to notify when a new user signs up",
    example: "https://your-server.com/webhooks/waitlist",
    format: "uri",
  })
  @IsUrl()
  @IsOptional()
  webhook_url?: string;

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
  is_available?: boolean;
}
