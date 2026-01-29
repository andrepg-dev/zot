import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  last_name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(100)
  password: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatar: string;
}
