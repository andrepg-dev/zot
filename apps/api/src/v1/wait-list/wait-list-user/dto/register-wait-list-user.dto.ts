import { IsEmail, IsOptional, IsString } from "class-validator";

export class RegisterWaitListUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  referred_by?: string;
}
