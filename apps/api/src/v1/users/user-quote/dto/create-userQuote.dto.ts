import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class CreateUserQuoteDto {
  @ApiProperty({
    description: "Available quota for user sign ups",
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  userSignUp: number;

  @ApiProperty({
    description: "Available quota for waitlist entries",
    example: 5000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  waitlist: number;

  @ApiProperty({
    description: "Available quota for landing page views or sessions",
    example: 10000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  landingPage: number;

  @ApiProperty({
    description: "Available quota for emails that can be sent",
    example: 10000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  emailsSent: number;

  @ApiProperty({
    description: "Available quota for email templates",
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  emailsTemplates: number;

  @ApiProperty({
    description: "Available quota for domains",
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  domains: number;
}
