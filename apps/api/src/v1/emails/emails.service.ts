import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Document } from "mongoose";
import { Model, Types } from "mongoose";
import { EmailSendingService } from "../core/email-sending/email-sending.service";
import { EmailTemplatesService } from "../email-templates/email-templates.service";
import { EmailTemplate } from "../email-templates/schemas/email-template.schema";
import { EmailParams, ResendEmail } from "../types/email-sending";
import { UserQuoteService } from "../users/user-quote/user-quote.service";
import { WaitListUser } from "../wait-list/schemas/wait-list-user.schema";
import { WaitListUserService } from "../wait-list/wait-list-user/wait-list-user.service";
import { EmailSendRecord } from "./schemas/email-send-record.schema";

interface SendEmailParams {
  waitlistId: Types.ObjectId;
  userId: Types.ObjectId;
  quantity: number;
}

interface GetEmailsRecord {
  waitlistId: Types.ObjectId;
  userId: Types.ObjectId;
}

interface sendEmailByUserId {
  userId: Types.ObjectId;
  waitlistId: Types.ObjectId;
  users: Array<Types.ObjectId>;
  email?: Omit<ResendEmail, "provider">;
  templateId?: string;
}

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(EmailSendRecord.name)
    private readonly emailSendRecordModel: Model<EmailSendRecord>,
    private readonly emailService: EmailSendingService,
    private readonly emailTemplateService: EmailTemplatesService,
    private readonly WaitListUserService: WaitListUserService,
    private readonly userquoteService: UserQuoteService,
    @InjectModel(WaitListUser.name) private readonly WaitListUserModel: Model<WaitListUser>,
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

    if (!usersList) {
      return { message: "WaitList users empty" };
    }

    const emailUsageSending = usersList.length;

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

    const payload: EmailParams = {
      from: "Zot WaitList <mail@zot.so>",
      to: usersList,
      provider: "resend",
      subject: "Testing if this works or not.",
      options: {
        html: "<bold>First email sending with zot.</bold>",
        replyTo: "reply@zot.so",
        text: "<bold>First email sending with zot.</bold>",
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { to: _, provider, ...rest } = payload;

    try {
      const result = await this.emailService.send(payload);

      await Promise.all([
        this.emailSendRecordModel.create({
          owner: userId,
          waitlistId,
          quantitySent: emailUsageSending,
          recipientEmails: usersList,
          sentSuccessfully: usersList.length,
          failedCount: 0,
          failedEmails: [],
          payload: rest,
        }),
        this.WaitListUserModel.updateMany(
          { waitlistId, email: { $in: usersList }, status: { $in: ["waiting", null] } },
          { $set: { status: "invited" } },
        ),
      ]);

      const usage = await this.userquoteService.editUserQuote({
        ownerId: userId,
        service: "emailsSent",
        usage: emailUsageSending,
      });

      return {
        ...result,
        quantity: emailUsageSending,
        emailsQuoteAvailable: usage.emailsSent,
      };
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if ((err as any)?.status != 500) {
        // If the problem is from the server, should not be in the user quote
        await this.userquoteService.editUserQuote({
          ownerId: userId,
          service: "emailsSent",
          usage: emailUsageSending,
        });
      }

      await this.emailSendRecordModel.create({
        owner: userId,
        waitlistId,
        quantitySent: emailUsageSending,
        recipientEmails: usersList,
        sentSuccessfully: 0,
        failedCount: usersList.length,
        failedEmails: usersList,
        payload: rest,
      });

      throw err;
    }
  }

  async sendEmailByUsersId({ userId, waitlistId, users, email, templateId }: sendEmailByUserId) {
    await this.WaitListUserService.validateOwnership(waitlistId, userId);

    let template: (EmailTemplate & Document) | undefined;

    if (templateId) {
      template = await this.emailTemplateService.findOne(new Types.ObjectId(templateId), userId);
    }

    if (!template) {
      throw new BadRequestException("Template not found.");
    }

    const usersIds = await this.WaitListUserModel.aggregate([
      {
        $match: {
          _id: { $in: users.map((id) => new Types.ObjectId(id)) },
          waitlistId: new Types.ObjectId(waitlistId),
        },
      },
      {
        $project: {
          email: 1,
          _id: 0,
        },
      },
    ]);

    const totalUsersCount = usersIds?.length;
    const userEmails = usersIds.map((user) => user?.email);

    if (totalUsersCount === 0) {
      throw new NotFoundException("Users not found in waitlist ID ");
    }

    const payload: EmailParams = {
      from: "Zot WaitList <mail@zot.so>",
      to: userEmails,
      provider: "resend",
      subject: template.subject,
      options: {
        html: template.html,
        replyTo: "mail@zot.so",
        // text: "<bold>First email sending with zot.</bold>",
      },
    };

    const { to: _, provider, ...rest } = payload;

    try {
      const result = await this.emailService.send(payload);

      await Promise.all([
        this.emailSendRecordModel.create({
          owner: userId,
          waitlistId,
          quantitySent: totalUsersCount,
          recipientEmails: userEmails,
          sentSuccessfully: totalUsersCount,
          failedCount: 0,
          failedEmails: [],
          payload: rest,
          template: template ? template.toObject() : undefined,
        }),
        this.WaitListUserModel.updateMany(
          {
            _id: { $in: users.map((id) => new Types.ObjectId(id)) },
            waitlistId: new Types.ObjectId(waitlistId),
            status: { $in: ["waiting", null] },
          },
          { $set: { status: "invited" } },
        ),
        this.userquoteService.editUserQuote({
          ownerId: userId,
          service: "emailsSent",
          usage: totalUsersCount,
        }),
      ]);

      return {
        ...result,
        quantity: totalUsersCount,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if ((error as any)?.status != 500) {
        // If the problem is from the server, should not be in the user quote
        await this.userquoteService.editUserQuote({
          ownerId: userId,
          service: "emailsSent",
          usage: totalUsersCount,
        });
      }

      await this.emailSendRecordModel.create({
        owner: userId,
        waitlistId,
        quantitySent: totalUsersCount,
        recipientEmails: userEmails,
        sentSuccessfully: 0,
        failedCount: totalUsersCount,
        failedEmails: userEmails,
        payload: rest,
        template: template ? template.toObject() : undefined,
      });

      throw error;
    }
  }

  async getEmailsRecord({ userId, waitlistId }: GetEmailsRecord) {
    return this.emailSendRecordModel.aggregate([
      {
        $match: { owner: userId, waitlistId },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sent: { $sum: "$sentSuccessfully" },
          failed: { $sum: "$failedCount" },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { createdAt: 1 } },
      { $project: { _id: 0, createdAt: 1, sent: 1, failed: 1 } },
    ]);
  }

  async getEmailSendRecordsList({ userId, waitlistId }: GetEmailsRecord) {
    return this.emailSendRecordModel
      .find({ owner: userId, waitlistId })
      .select("-owner -waitlistId")
      .sort({ createdAt: -1 });
  }
}
