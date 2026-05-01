import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Document } from "mongoose";
import { Model, Types } from "mongoose";
import pLimit from "p-limit";
import type { ComponentType } from "react";
import { EmailSendingService } from "../core/email-sending/email-sending.service";
import { ReactToHtmlService } from "../core/react-to-html/react-to-html.service";
import { EmailTemplatesService } from "../email-templates/email-templates.service";
import { EmailTemplate } from "../email-templates/schemas/email-template.schema";
import { EmailParams, ResendEmail } from "../types/email-sending";
import { UserQuoteService } from "../users/user-quote/user-quote.service";
import { WaitListUser } from "../wait-list/schemas/wait-list-user.schema";
import { WaitList } from "../wait-list/schemas/wait-list.schema";
import { WaitListUserService } from "../wait-list/wait-list-user/wait-list-user.service";
import { EmailSendRecord } from "./schemas/email-send-record.schema";

const RESEND_BATCH_SIZE = 100;
const BATCH_CONCURRENCY = 3;

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
  mapping?: Record<string, string>;
  variables?: Record<string, unknown>;
}

type RecipientRow = {
  _id: Types.ObjectId;
  email: string;
  name?: string;
  position?: number;
  referredBy?: string;
  createdAt?: Date;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    @InjectModel(EmailSendRecord.name)
    private readonly emailSendRecordModel: Model<EmailSendRecord>,
    private readonly emailService: EmailSendingService,
    private readonly emailTemplateService: EmailTemplatesService,
    private readonly WaitListUserService: WaitListUserService,
    private readonly userquoteService: UserQuoteService,
    private readonly reactToHtmlService: ReactToHtmlService,
    @InjectModel(WaitListUser.name) private readonly WaitListUserModel: Model<WaitListUser>,
    @InjectModel(WaitList.name) private readonly WaitListModel: Model<WaitList>,
  ) {}

  private resolveFieldPath(
    recipient: RecipientRow,
    path: string,
    globals: Record<string, unknown>,
  ): unknown {
    if (!path) return undefined;

    const [root, ...rest] = path.split(".");

    if (root === "globals") {
      if (rest.length === 0) return globals;
      let current: unknown = globals;
      for (const segment of rest) {
        if (current == null || typeof current !== "object") return undefined;
        current = (current as Record<string, unknown>)[segment];
      }
      return current;
    }

    if (root === "metadata") {
      if (rest.length === 0) return recipient.metadata;
      let current: unknown = recipient.metadata;
      for (const segment of rest) {
        if (current == null || typeof current !== "object") return undefined;
        current = (current as Record<string, unknown>)[segment];
      }
      return current;
    }

    return (recipient as unknown as Record<string, unknown>)[root];
  }

  private buildRecipientVariables(
    recipient: RecipientRow,
    mapping: Record<string, string> | undefined,
    extra: Record<string, unknown> = {},
    globals: Record<string, unknown> = {},
  ): Record<string, unknown> {
    const resolved: Record<string, unknown> = mapping
      ? Object.fromEntries(
          Object.entries(mapping).map(([variable, path]) => [
            variable,
            this.resolveFieldPath(recipient, path, globals),
          ]),
        )
      : {
          recipientName: recipient.name ?? "",
          recipientEmail: recipient.email,
          email: recipient.email,
          position: recipient.position,
          referredBy: recipient.referredBy,
          ...globals,
        };

    return { ...resolved, ...extra };
  }

  private renderSubject(template: string, vars: Record<string, unknown>): string {
    if (!template) return template;
    return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) => {
      const segments = key.split(".");
      let current: unknown = vars;
      for (const segment of segments) {
        if (current == null || typeof current !== "object") return "";
        current = (current as Record<string, unknown>)[segment];
      }
      return current == null ? "" : String(current);
    });
  }

  private async processBatch(
    chunk: RecipientRow[],
    Component: ComponentType<Record<string, unknown>>,
    basePayload: Omit<EmailParams, "to" | "options" | "subject"> & {
      options: Omit<ResendEmail["options"], "html">;
      subjectTemplate: string;
    },
    mapping: Record<string, string> | undefined,
    variables: Record<string, unknown> | undefined,
    globals: Record<string, unknown>,
  ): Promise<{ sent: string[]; failed: string[] }> {
    const rendered: Array<{ recipient: RecipientRow; html: string; subject: string }> = [];
    const failed: string[] = [];

    await Promise.all(
      chunk.map(async (recipient) => {
        try {
          const recipientVars = this.buildRecipientVariables(
            recipient,
            mapping,
            variables,
            globals,
          );
          const html = await this.reactToHtmlService.renderComponent(Component, recipientVars);
          const subject = this.renderSubject(basePayload.subjectTemplate, {
            ...globals,
            ...recipientVars,
          });
          rendered.push({ recipient, html, subject });
        } catch (err) {
          this.logger.warn(`Render failed for ${recipient.email}: ${(err as Error).message}`);
          failed.push(recipient.email);
        }
      }),
    );

    if (rendered.length === 0) {
      return { sent: [], failed };
    }

    const { subjectTemplate: _subjectTemplate, ...sendBase } = basePayload;

    try {
      await this.emailService.sendBatch(
        rendered.map(({ recipient, html, subject }) => ({
          ...sendBase,
          subject,
          to: recipient.email,
          options: { ...sendBase.options, html },
        })),
      );

      return {
        sent: rendered.map((r) => r.recipient.email),
        failed,
      };
    } catch (err) {
      this.logger.warn(
        `Batch send failed for ${rendered.length} emails: ${(err as Error).message}`,
      );
      return {
        sent: [],
        failed: [...failed, ...rendered.map((r) => r.recipient.email)],
      };
    }
  }

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

  async sendEmailByUsersId({
    userId,
    waitlistId,
    users,
    templateId,
    mapping,
    variables,
  }: sendEmailByUserId) {
    await this.WaitListUserService.validateOwnership(waitlistId, userId);

    let template: (EmailTemplate & Document) | undefined;

    if (templateId) {
      template = await this.emailTemplateService.findOne(new Types.ObjectId(templateId), userId);
    }

    if (!template) {
      throw new BadRequestException("Template not found.");
    }

    if (!template.code) {
      throw new BadRequestException("Template is missing source code to render.");
    }

    const recipients: RecipientRow[] = await this.WaitListUserModel.aggregate([
      {
        $match: {
          _id: { $in: users.map((id) => new Types.ObjectId(id)) },
          waitlistId: new Types.ObjectId(waitlistId),
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          name: 1,
          position: 1,
          referredBy: 1,
          createdAt: 1,
          metadata: 1,
        },
      },
    ]);

    const totalUsersCount = recipients.length;
    const userEmails = recipients.map((user) => user.email);

    if (totalUsersCount === 0) {
      throw new NotFoundException("Users not found in waitlist ID ");
    }

    const Component = this.reactToHtmlService.compileComponent(template.code);

    const waitlist = await this.WaitListModel.findById(waitlistId).select("name").lean();
    const globals: Record<string, unknown> = {
      waitlistName: waitlist?.name ?? "",
    };

    const fromName = (waitlist?.name ?? "Zot Waitlist").replace(/[<>"]/g, "").trim() || "Zot Waitlist";

    const basePayload: Omit<EmailParams, "to" | "options" | "subject"> & {
      options: Omit<ResendEmail["options"], "html">;
      subjectTemplate: string;
    } = {
      from: `${fromName} <mail@zot.so>`,
      provider: "resend",
      subjectTemplate: template.subject,
      options: {
        replyTo: "mail@zot.so",
      },
    };

    const chunks: RecipientRow[][] = [];
    for (let i = 0; i < recipients.length; i += RESEND_BATCH_SIZE) {
      chunks.push(recipients.slice(i, i + RESEND_BATCH_SIZE));
    }

    const limit = pLimit(BATCH_CONCURRENCY);

    const chunkResults = await Promise.all(
      chunks.map((chunk) =>
        limit(async () =>
          this.processBatch(chunk, Component, basePayload, mapping, variables, globals),
        ),
      ),
    );

    const sentEmails: string[] = [];
    const failedEmails: string[] = [];
    for (const result of chunkResults) {
      sentEmails.push(...result.sent);
      failedEmails.push(...result.failed);
    }

    const sentSuccessfully = sentEmails.length;
    const failedCount = failedEmails.length;

    await this.emailSendRecordModel.create({
      owner: userId,
      waitlistId,
      quantitySent: totalUsersCount,
      recipientEmails: userEmails,
      sentSuccessfully,
      failedCount,
      failedEmails,
      payload: basePayload,
      template: template.toObject(),
    });

    if (sentSuccessfully > 0) {
      await Promise.all([
        this.WaitListUserModel.updateMany(
          {
            waitlistId: new Types.ObjectId(waitlistId),
            email: { $in: sentEmails },
            status: { $in: ["waiting", null] },
          },
          { $set: { status: "invited" } },
        ),
        this.userquoteService.editUserQuote({
          ownerId: userId,
          service: "emailsSent",
          usage: sentSuccessfully,
        }),
      ]);
    }

    if (failedCount === totalUsersCount) {
      throw new BadRequestException("All email sends failed.");
    }

    return {
      quantity: sentSuccessfully,
      failedCount,
      failedEmails,
    };
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
