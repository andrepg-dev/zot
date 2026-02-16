import { IsString } from "class-validator";

export class CreateEmailDto {
  @IsString()
  waitlistId: string;
}
