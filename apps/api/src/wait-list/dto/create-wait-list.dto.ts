import { IsString } from "class-validator";

export class CreateWaitListDto {
  @IsString()
  name: string;
}
