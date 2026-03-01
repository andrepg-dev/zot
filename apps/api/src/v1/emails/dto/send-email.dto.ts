import { IsMongoId, IsNumber, IsPositive } from "class-validator";
import { Types } from "mongoose";

export class SendEmailDto {
  @IsMongoId()
  waitlistId: Types.ObjectId;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
