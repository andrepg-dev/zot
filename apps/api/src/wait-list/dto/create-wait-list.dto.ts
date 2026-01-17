import { IsMongoId, IsString } from "class-validator";

export class CreateWaitListDto {
  @IsString()
  name: string;

  @IsString()
  webhook_url: string;

  @IsMongoId({ message: "Invalid mongoDB ObjectId" })
  @IsString()
  widget_id: string;
}
