import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min, ValidateNested } from "class-validator";

export class DomainsQuoteDto {
  @ApiProperty({ description: "Quota for email domains", example: 10, minimum: 0 })
  @IsNumber()
  @Min(0)
  email: number;

  @ApiProperty({ description: "Quota for general domains", example: 10000, minimum: 0 })
  @IsNumber()
  @Min(0)
  general: number;
}

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
    description: "Available quota for domains (email vs general)",
    example: { email: 10, general: 10000 },
  })
  @ValidateNested()
  @Type(() => DomainsQuoteDto)
  domains: DomainsQuoteDto;
}
