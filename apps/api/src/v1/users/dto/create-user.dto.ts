import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "User first name",
    example: "John",
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  last_name: string;

  @ApiProperty({
    description: "User email address (must be unique)",
    example: "john.doe@example.com",
    maxLength: 100,
    format: "email",
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: "User password",
    example: "SecureP@ssw0rd!",
    maxLength: 100,
    format: "password",
  })
  @IsString()
  @MaxLength(100)
  password: string;

  @ApiPropertyOptional({
    description: "URL to user avatar image",
    example: "https://example.com/avatars/john-doe.jpg",
    format: "uri",
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  avatar?: string;
}
