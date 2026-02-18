import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Types } from "mongoose";
import { SendEmailDto } from "./dto/send-email.dto";
import { EmailsService } from "./emails.service";

@Controller("emails")
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  @HttpCode(200)
  async sendEmail(@Body() params: SendEmailDto, @UserId() userId: Types.ObjectId) {
    return await this.emailsService.sendEmail({ userId, ...params });
  }
}
