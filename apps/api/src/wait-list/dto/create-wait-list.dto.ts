import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateWaitListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  send_email_to_new_signup: boolean;

  @IsUrl()
  @IsOptional()
  webhook_url?: string;

  @IsMongoId({ message: "Invalid mongoDB ObjectId" })
  @IsString()
  @IsOptional()
  widget_id?: string;

  @IsBoolean()
  @IsOptional()
  is_available: boolean;
}
