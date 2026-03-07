import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { WaitList } from "../schemas/wait-list.schema";

export type WaitListStats = Omit<WaitList, "owner"> & {
  users: {
    organic: number;
    referred: number;
    total: number;
  };
  emailsSent: number;
  dailyRegistration: Array<{ createdAt: Date; registrations: number }>;
  topReferrers: Array<{ email: string; referrals: number }>;
};

@Injectable()
export class StatsService {
  constructor(@InjectModel(WaitList.name) private readonly WaitListModel: Model<WaitList>) {}

  async getWaitListStats(waitlistId: Types.ObjectId, owner: Types.ObjectId) {
    /**
     * 
      Total Sign Ups
      Total Referrals
      Sign Ups Today
      Emails sent
      Fake users blocked
     */
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const stats = await this.WaitListModel.aggregate<WaitListStats>([
      {
        $match: { owner, _id: waitlistId },
      },
      {
        $lookup: {
          from: "waitlistusers",
          localField: "_id",
          foreignField: "waitlistId",
          as: "usersRegistered",
          pipeline: [
            {
              $project: {
                waitlistId: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "emailsendrecords",
          localField: "_id",
          foreignField: "waitlistId",
          as: "emailsSentPopulate",
        },
      },
      {
        $lookup: {
          from: "waitlistusers",
          let: { waitlistId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$waitlistId", "$$waitlistId"] } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                registrations: { $sum: 1 },
                createdAt: { $first: "$createdAt" },
              },
            },
            { $sort: { createdAt: 1 } },
            { $project: { _id: 0, createdAt: 1, registrations: 1 } },
          ],
          as: "dailyRegistration",
        },
      },
      {
        $lookup: {
          from: "waitlistusers",
          let: { waitlistId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$waitlistId", "$$waitlistId"] },
                    { $ne: [{ $ifNull: ["$referredBy", null] }, null] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$referredBy",
                referrals: { $sum: 1 },
              },
            },
            { $sort: { referrals: -1 } },
            { $project: { _id: 0, email: "$_id", referrals: 1 } },
          ],
          as: "topReferrers",
        },
      },
      {
        $addFields: {
          users: {
            total: { $size: "$usersRegistered" },
            referred: {
              $size: {
                $filter: {
                  input: "$usersRegistered",
                  as: "u",
                  cond: { $ne: [{ $ifNull: ["$$u.referredBy", null] }, null] },
                },
              },
            },
            organic: {
              $size: {
                $filter: {
                  input: "$usersRegistered",
                  as: "u",
                  cond: { $eq: [{ $ifNull: ["$$u.referredBy", null] }, null] },
                },
              },
            },
            signUpsToday: {
              $size: {
                $filter: {
                  input: "$usersRegistered",
                  as: "u",
                  cond: {
                    $and: [
                      { $gte: ["$$u.createdAt", startOfToday] },
                      { $lt: ["$$u.createdAt", endOfToday] },
                    ],
                  },
                },
              },
            },
          },
          emailsSent: {
            $sum: "$emailsSentPopulate.quantitySent",
          },
        },
      },
      {
        $project: {
          owner: 0,
          emailsSentPopulate: 0,
          usersRegistered: 0,
        },
      },
    ]);

    /**
     * Top Referrers
     *
     * [ {email: "", referrals: number} ]
     */

    return stats[0];
  }
}
