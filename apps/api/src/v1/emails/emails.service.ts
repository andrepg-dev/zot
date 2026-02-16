import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResendService } from "nestjs-resend";

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(EmailsService.name) private EmailModel: Model<EmailsService>,
    private readonly resendService: ResendService,
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
   * @param { waitlistId, waitlistUserId, userId, quantity }
   * @returns
   */
  async sendEmail({
    waitlistId,
    waitlistUserId,
    userId,
    quantity,
  }: {
    waitlistId: string;
    waitlistUserId: string;
    userId: Types.ObjectId;
    quantity: number;
  }) {
    // I need to configure this to send emails, for more information I can look at: https://github.com/jiangtaste/nestjs-resend
    await this.resendService.send({
      from: "",
      to: "",
      subject: "",
      text: "",
    });

    // Send email to users with resend service SDK
    return { waitlistId, waitlistUserId, owner: userId, quantity };
  }
}
