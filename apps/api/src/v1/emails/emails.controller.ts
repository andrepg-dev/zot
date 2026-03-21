import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { SendEmailDto } from "./dto/send-email.dto";
import { EmailsService } from "./emails.service";

@Controller("emails")
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  @HttpCode(200)
  async sendEmail(
    @Body("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Body() { quantity }: SendEmailDto,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.emailsService.sendEmail({
      userId,
      waitlistId: waitlistId,
      quantity: quantity,
    });
  }

  @Get(":waitlistId/records")
  async getEmailsRecord(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.emailsService.getEmailsRecord({
      userId,
      waitlistId,
    });
  }

  @Get(":waitlistId/records/list")
  async getEmailSendRecordsList(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.emailsService.getEmailSendRecordsList({
      userId,
      waitlistId,
    });
  }
}
