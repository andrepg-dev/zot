import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { EmailSecurity } from "../core/email-security/schemas/email-security.schema";
import { EmailSendRecord } from "../emails/schemas/email-send-record.schema";
import { WaitList } from "../wait-list/schemas/wait-list.schema";
import { WaitlistWebhookEvent } from "../wait-list/schemas/waitlist-webhooks-events.schema";
import { WaitListUserService } from "../wait-list/wait-list-user/wait-list-user.service";

@Injectable()
export class GeneralStatsService {
  constructor(
    private readonly waitlist: WaitListUserService,
    @InjectModel(WaitList.name) private waitListModel: Model<WaitList>,
    @InjectModel(EmailSendRecord.name) private emailSendRecordModel: Model<EmailSendRecord>,
    @InjectModel(EmailSecurity.name) private emailSecurityModel: Model<EmailSecurity>,
    @InjectModel(WaitlistWebhookEvent.name)
    private webhookEventModel: Model<WaitlistWebhookEvent>,
  ) {}

  async getGeneralStats(userId: Types.ObjectId) {
    const waitlistIds = await this.waitListModel.find({ owner: userId }).select("_id").lean();
    const ids = waitlistIds.map((w) => w._id);

    const [signupsByDay, emailsByDay, blockedByDay, webhooksByDay] = await Promise.all([
      this.waitlist.getAllUsersBasedOnOwner(userId, [
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
      this.emailSendRecordModel.aggregate([
        { $match: { waitlistId: { $in: ids } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: "$quantitySent" },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
      this.emailSecurityModel.aggregate([
        { $match: { waitlistId: { $in: ids }, isBlocked: true } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
      this.webhookEventModel.aggregate([
        { $match: { waitlistId: { $in: ids } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$sentAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
    ]);

    return {
      signupsByDay,
      emailsByDay,
      blockedByDay,
      webhooksByDay,
    };
  }
}
