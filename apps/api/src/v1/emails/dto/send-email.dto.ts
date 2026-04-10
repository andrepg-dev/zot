import { ArrayMinSize, IsArray, IsMongoId, IsNumber, IsPositive } from "class-validator";
import { Types } from "mongoose";

export class SendEmailDto {
  @IsMongoId()
  waitlistId: Types.ObjectId;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class SendEmailToUsersById {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  users: Array<Types.ObjectId>;
}
