import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class CreateWidgetDto {
  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @IsBoolean()
  is_refered: boolean;
}
