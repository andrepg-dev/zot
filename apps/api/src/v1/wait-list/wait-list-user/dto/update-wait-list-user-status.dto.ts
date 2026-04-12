import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";
import {
  WAITLIST_USER_STATUSES,
  type WaitListUserStatus,
} from "../../schemas/wait-list-user.schema";

export class UpdateWaitListUserStatusDto {
  @ApiProperty({
    description: "Email of the waitlist user",
    example: "user@example.com",
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: "New status for the user",
    enum: WAITLIST_USER_STATUSES,
    example: "converted",
  })
  @IsIn(WAITLIST_USER_STATUSES)
  status: WaitListUserStatus;
}
