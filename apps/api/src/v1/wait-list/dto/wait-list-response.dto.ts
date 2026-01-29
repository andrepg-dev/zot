import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class WaitListResponseDto {
  @ApiProperty({
    description: "Unique identifier of the waitlist",
    example: "507f1f77bcf86cd799439011",
  })
  _id: string;

  @ApiProperty({
    description: "Name of the waitlist",
    example: "Product Launch Waitlist",
  })
  name: string;

  @ApiProperty({
    description: "Whether confirmation emails are sent to new signups",
    example: true,
  })
  send_email_to_new_signup: boolean;

  @ApiPropertyOptional({
    description: "Webhook URL for new signup notifications",
    example: "https://your-server.com/webhooks/waitlist",
  })
  webhook_url?: string;

  @ApiPropertyOptional({
    description: "Associated widget ID",
    example: "507f1f77bcf86cd799439011",
  })
  widget_id?: string;

  @ApiProperty({
    description: "Whether the waitlist is accepting signups",
    example: true,
  })
  is_available: boolean;

  @ApiProperty({
    description: "Owner user ID",
    example: "507f1f77bcf86cd799439011",
  })
  user_id: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  updatedAt: Date;
}
