import { IsNotEmpty, IsString } from "class-validator";

export class ReactToHtmlDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
