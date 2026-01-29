import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenResponseDto {
  @ApiProperty({
    description: "JWT access token for authenticated requests",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  access_token: string;
}

export class UserProfileResponseDto {
  @ApiProperty({
    description: "User unique identifier",
    example: "507f1f77bcf86cd799439011",
  })
  userId: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: "Logout confirmation message",
    example: "Logged out successfully",
  })
  message: string;
}

export class LoginDto {
  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
    format: "email",
  })
  email: string;

  @ApiProperty({
    description: "User password",
    example: "SecureP@ssw0rd!",
    format: "password",
  })
  password: string;
}
