import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateApiKeyDto {
  @ApiProperty({
    description: "Name to identify the API key",
    example: "Production API Key",
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
