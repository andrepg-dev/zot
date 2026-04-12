import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { WaitListUser } from "../wait-list/schemas/wait-list-user.schema";
import { WaitList } from "../wait-list/schemas/wait-list.schema";

@Injectable()
export class GeneralStatsService {
  constructor(
    @InjectModel(WaitList.name) private waitListModel: Model<WaitList>,
    @InjectModel(WaitListUser.name) private waitListUserModel: Model<WaitListUser>,
  ) {}

  async getDashboardStats(userId: Types.ObjectId) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const waitlists = await this.waitListModel.find({ owner: userId }).select("+owner").lean();
    const waitlistIds = waitlists.map((w) => w._id);

    const [
      totalSignups,
      signupsLast30,
      statusCounts,
      sourceCounts,
      recentSignups,
      avgWaitDays,
    ] = await Promise.all([
      // Total signups across all waitlists
      this.waitListUserModel.countDocuments({ waitlistId: { $in: waitlistIds } }),

      // Signups in last 30 days
      this.waitListUserModel.countDocuments({
        waitlistId: { $in: waitlistIds },
        createdAt: { $gte: thirtyDaysAgo },
      }),

      // Status breakdown (null/missing defaults to "waiting")
      this.waitListUserModel.aggregate([
        { $match: { waitlistId: { $in: waitlistIds } } },
        { $group: { _id: { $ifNull: ["$status", "waiting"] }, count: { $sum: 1 } } },
      ]),

      // Source breakdown (null/missing defaults to "organic")
      this.waitListUserModel.aggregate([
        { $match: { waitlistId: { $in: waitlistIds } } },
        {
          $group: {
            _id: { $ifNull: ["$source", "organic"] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Recent signups with waitlist name
      this.waitListUserModel.aggregate([
        { $match: { waitlistId: { $in: waitlistIds } } },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "waitlists",
            localField: "waitlistId",
            foreignField: "_id",
            as: "waitlist",
          },
        },
        { $unwind: { path: "$waitlist", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            waitlistName: "$waitlist.name",
            position: 1,
            source: 1,
            status: 1,
            createdAt: 1,
          },
        },
      ]),

      // Average wait time for "waiting" users (in days)
      this.waitListUserModel.aggregate([
        {
          $match: {
            waitlistId: { $in: waitlistIds },
            status: { $in: ["waiting", null, undefined] },
          },
        },
        {
          $group: {
            _id: null,
            avgWait: {
              $avg: { $divide: [{ $subtract: [now, "$createdAt"] }, 1000 * 60 * 60 * 24] },
            },
          },
        },
      ]),
    ]);

    // Calculate active waitlists
    const activeWaitlists = waitlists.filter((w) => w.isAvailable).length;
    const totalWaitlists = waitlists.length;
    const newWaitlistsLast30 = waitlists.filter(
      (w) => w.isAvailable && new Date((w as any).createdAt).getTime() >= thirtyDaysAgo.getTime(),
    ).length;

    // Calculate conversion rate
    const statusMap = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
    const convertedCount = statusMap["converted"] || 0;
    const conversionRate = totalSignups > 0 ? (convertedCount / totalSignups) * 100 : 0;

    // Avg wait time
    const currentAvgWait = avgWaitDays[0]?.avgWait ?? 0;

    // Source percentages
    const maxSourceCount = sourceCounts.length > 0 ? sourceCounts[0].count : 1;
    const signupsBySource = sourceCounts.map((s) => ({
      source: s._id,
      count: s.count,
      percentage: Math.round((s.count / maxSourceCount) * 100),
    }));

    // Waitlist status breakdown
    const waitlistStatus = [
      { status: "waiting", count: statusMap["waiting"] || 0 },
      { status: "invited", count: statusMap["invited"] || 0 },
      { status: "converted", count: statusMap["converted"] || 0 },
      { status: "churned", count: statusMap["churned"] || 0 },
    ];

    return {
      totalSignups: {
        value: totalSignups,
        change: signupsLast30,
      },
      activeWaitlists: {
        value: activeWaitlists,
        total: totalWaitlists,
        change: newWaitlistsLast30,
      },
      conversionRate: {
        value: Math.round(conversionRate * 10) / 10,
        change: convertedCount,
      },
      avgWaitTime: {
        value: Math.round(currentAvgWait * 10) / 10,
        change: Math.round(currentAvgWait * 10) / 10,
      },
      signupsBySource,
      waitlistStatus,
      recentSignups,
    };
  }
}
