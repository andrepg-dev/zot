import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
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

  @IsString()
  @IsOptional()
  templateId: string;

  @IsObject()
  @IsOptional()
  mapping?: Record<string, string>;

  @IsObject()
  @IsOptional()
  variables?: Record<string, unknown>;
}
