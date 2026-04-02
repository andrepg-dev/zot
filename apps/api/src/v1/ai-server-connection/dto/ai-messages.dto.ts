import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AIMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  message: string;
}
