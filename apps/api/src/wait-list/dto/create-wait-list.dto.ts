import { IsMongoId, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateWaitListDto {
  @IsString()
  name: string;

  @IsUrl()
  @IsOptional()
  webhook_url?: string;

  @IsMongoId({ message: "Invalid mongoDB ObjectId" })
  @IsString()
  @IsOptional()
  widget_id?: string;
}
