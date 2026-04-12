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
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const waitlists = await this.waitListModel.find({ owner: userId }).select("+owner").lean();
    const waitlistIds = waitlists.map((w) => w._id);

    const [
      totalSignups,
      signupsLast30,
      signupsPrev30,
      statusCounts,
      statusCountsPrev,
      sourceCounts,
      recentSignups,
      avgWaitDays,
      avgWaitDaysPrev,
    ] = await Promise.all([
      // Total signups across all waitlists
      this.waitListUserModel.countDocuments({ waitlistId: { $in: waitlistIds } }),

      // Signups in last 30 days
      this.waitListUserModel.countDocuments({
        waitlistId: { $in: waitlistIds },
        createdAt: { $gte: thirtyDaysAgo },
      }),

      // Signups in prev 30 days (30-60 days ago)
      this.waitListUserModel.countDocuments({
        waitlistId: { $in: waitlistIds },
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),

      // Status breakdown (current)
      this.waitListUserModel.aggregate([
        { $match: { waitlistId: { $in: waitlistIds } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Status breakdown (30 days ago snapshot — users created before 30 days ago)
      this.waitListUserModel.aggregate([
        {
          $match: {
            waitlistId: { $in: waitlistIds },
            createdAt: { $lt: thirtyDaysAgo },
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Source breakdown
      this.waitListUserModel.aggregate([
        { $match: { waitlistId: { $in: waitlistIds } } },
        { $group: { _id: "$source", count: { $sum: 1 } } },
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

      // Average wait time for "waiting" users (in days) - current
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

      // Average wait time 30 days ago
      this.waitListUserModel.aggregate([
        {
          $match: {
            waitlistId: { $in: waitlistIds },
            status: { $in: ["waiting", null, undefined] },
            createdAt: { $lt: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            avgWait: {
              $avg: {
                $divide: [{ $subtract: [thirtyDaysAgo, "$createdAt"] }, 1000 * 60 * 60 * 24],
              },
            },
          },
        },
      ]),
    ]);

    // Calculate active waitlists
    const activeWaitlists = waitlists.filter((w) => w.isAvailable).length;
    const totalWaitlists = waitlists.length;

    // Calculate conversion rate
    const statusMap = Object.fromEntries(statusCounts.map((s) => [s._id || "waiting", s.count]));
    const convertedCount = statusMap["converted"] || 0;
    const conversionRate = totalSignups > 0 ? (convertedCount / totalSignups) * 100 : 0;

    const statusMapPrev = Object.fromEntries(
      statusCountsPrev.map((s) => [s._id || "waiting", s.count]),
    );
    const prevTotal: number = Object.values(statusMapPrev).reduce(
      (sum: number, c) => sum + (c as number),
      0,
    ) as number;
    const prevConverted = (statusMapPrev["converted"] as number) || 0;
    const prevConversionRate = prevTotal > 0 ? (prevConverted / prevTotal) * 100 : 0;

    // Signups change percentage
    const signupsChange =
      signupsPrev30 > 0 ? Math.round(((signupsLast30 - signupsPrev30) / signupsPrev30) * 100) : 0;

    // Avg wait time
    const currentAvgWait = avgWaitDays[0]?.avgWait ?? 0;
    const prevAvgWait = avgWaitDaysPrev[0]?.avgWait ?? 0;

    // Source percentages
    const maxSourceCount = sourceCounts.length > 0 ? sourceCounts[0].count : 1;
    const signupsBySource = sourceCounts.map((s) => ({
      source: s._id || "organic",
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
        change: signupsChange,
      },
      activeWaitlists: {
        value: activeWaitlists,
        total: totalWaitlists,
        change: 0,
      },
      conversionRate: {
        value: Math.round(conversionRate * 10) / 10,
        change: Math.round((conversionRate - prevConversionRate) * 10) / 10,
      },
      avgWaitTime: {
        value: Math.round(currentAvgWait * 10) / 10,
        change: Math.round((currentAvgWait - prevAvgWait) * 10) / 10,
      },
      signupsBySource,
      waitlistStatus,
      recentSignups,
    };
  }
}
