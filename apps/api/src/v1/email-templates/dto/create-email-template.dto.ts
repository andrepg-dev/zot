import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateEmailTemplateDto {
  @IsString()
  alias: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  code: string;

  @IsEnum(["draft", "published"])
  status: string;
}
