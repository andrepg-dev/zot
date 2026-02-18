import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { EmailSendingService } from "../core/email-sending/email-sending.service";

interface SendEmailParams {
  waitlistId: Types.ObjectId;
  waitlistUserId: Types.ObjectId;
  userId: Types.ObjectId;
  quantity: number;
}

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(EmailsService.name) private EmailModel: Model<EmailsService>,
    private readonly emailService: EmailSendingService,
  ) {}

  /**
   *In this function, i need to see the user who is sending the template, and limit him to send emails.
   *
   * But this functions is more complex than i expected :v, because i need not only the quantity,
   * i need the template to send, so i should have a function that can sent and email based on a template
   * So first, i should have the template system creation working correctly and I thing that is not too hard for the MVP.
   *
   * The MVP template don't gonna have variables to send, just gonna be a template, also, i can make this service to accept not to send templates
   *
   * For now, i can include not to send with template
   *
   * @param {SendEmailParams} SendEmailParams
   * @returns
   */

  async sendEmail({ userId, waitlistId, waitlistUserId, quantity }: SendEmailParams) {
    // I need to configure this to send emails, for more information I can look at: https://github.com/jiangtaste/nestjs-resend

    // Send email to users with resend service SDK
    return await this.emailService.send({
      from: "Zot WaitList <mail@zot.so>",
      to: ["asponceg@gmail.com"],
      provider: "resend",
      subject: "Testing if this works or not.",
      options: {
        html: "<bold>First email sending with zot.</bold>",
      },
    });
  }
}
