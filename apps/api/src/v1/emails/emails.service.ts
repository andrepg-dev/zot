import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { EmailSendingService } from "../core/email-sending/email-sending.service";
import { EmailParams } from "../types/email-sending";
import { UserQuoteService } from "../users/user-quote/user-quote.service";
import { WaitListUserService } from "../wait-list/wait-list-user/wait-list-user.service";
import { EmailSendRecord } from "./schemas/email-send-record.schema";

interface SendEmailParams {
  waitlistId: Types.ObjectId;
  userId: Types.ObjectId;
  quantity: number;
}

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(EmailSendRecord.name)
    private readonly emailSendRecordModel: Model<EmailSendRecord>,
    private readonly emailService: EmailSendingService,
    private readonly WaitListUserService: WaitListUserService,
    private readonly userquoteService: UserQuoteService,
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

  async sendEmail({ userId, waitlistId, quantity }: SendEmailParams) {
    // I need to configure this to send emails, for more information I can look at: https://github.com/jiangtaste/nestjs-resend

    // Get the wailitst users
    const users: Array<{ emails: Array<string> }> | null = await this.WaitListUserService.findAll(
      waitlistId,
      userId,
      [
        {
          $limit: quantity,
        },
        {
          $project: { email: 1, _id: 0 },
        },
        {
          $group: {
            _id: null,
            emails: { $push: "$email" },
          },
        },
        {
          $project: { _id: 0, emails: 1 },
        },
      ],
    );

    const usersList = users[0]?.emails ?? null;

    console.log({ usersList });

    if (!usersList) {
      return { message: "WaitList users empty" };
    }

    const emailUsageSending = usersList.length;

    const usage = await this.userquoteService.editUserQuote(userId, {
      service: "emailsSent",
      decrease: emailUsageSending,
    });

    console.log({ emailUsageSending, usage });

    // How to save emails sending stats
    /**
     * Puedo hacer algo, ya sea guardar los datos de la waitlist en el mismo esquema, o hacer un esquema completamente aparte, que contenga a los usuarios
     * A los que se hizo envío de los emails, y que tengan una waitlist relacionada con ello
     *
     * La manera en que se hace los "sign ups" es en base a un esquema, es un endpoint el cual los usuarios se registran, de esa manera
     * hay más control en como se manejan los usuarios, lo mismo con el emails sent y haré lo mismo con fake users blocked, porque también, sería bueno tener
     * una chart que controle en qué días envié los correos electrónicos, entonces para eso, necesito una waitlist espefica.
     *
     * Otherwise, i probably should save the email sending on the waitlist itself, what probably is not bad, but in performance, could not bee too good,
     * So, i going to create the schema.
     *
     * The schema, should contain things like,
     * WaitList id, timestamp, quantity email has sent, list of users who emails has been sent, correctly emails sent and the fails ones.
     */

    const sendPayload: EmailParams = {
      from: "Zot WaitList <mail@zot.so>",
      to: usersList,
      provider: "resend",
      subject: "Testing if this works or not.",
      options: {
        html: "<bold>First email sending with zot.</bold>",
      },
    };

    try {
      const result = await this.emailService.send(sendPayload);

      await this.emailSendRecordModel.create({
        owner: userId,
        waitlistId,
        quantitySent: emailUsageSending,
        recipientEmails: usersList,
        sentSuccessfully: usersList.length,
        failedCount: 0,
        failedEmails: [],
      });

      return {
        ...result,
        quantity: emailUsageSending,
        users: usersList,
        emailsQuoteAvailable: usage.emailsSent,
      };
    } catch (error) {
      await this.emailSendRecordModel.create({
        owner: userId,
        waitlistId,
        quantitySent: emailUsageSending,
        recipientEmails: usersList,
        sentSuccessfully: 0,
        failedCount: usersList.length,
        failedEmails: usersList,
      });
      throw error;
    }
  }
}
