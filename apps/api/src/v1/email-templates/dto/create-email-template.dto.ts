import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateEmailTemplateDto {
  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  code: string;

  @IsEnum(["draft", "published"])
  status: "draft" | "published";
}
