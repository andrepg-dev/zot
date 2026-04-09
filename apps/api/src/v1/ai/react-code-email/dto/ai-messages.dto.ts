import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AIMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  message: string = "";

  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class UpdateReactCodeEmailConversation {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(50)
  title: string = "";
}
