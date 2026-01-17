import { IsMongoId, IsString } from "class-validator";

export class CreateWaitListDto {
  @IsString()
  name: string;

  @IsString()
  webhookURL: string;

  @IsMongoId({ message: "Invalid mongoDB ObjectId" })
  @IsString()
  widgetId: string;
}
