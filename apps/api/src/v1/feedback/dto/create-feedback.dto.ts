import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateFeedbackDto {
  @ApiProperty({
    description: "The feedback message from the user",
    example: "I would love to see dark mode support.",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
