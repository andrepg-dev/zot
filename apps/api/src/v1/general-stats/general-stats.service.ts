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

  async getDashboardStats(userId: Types.ObjectId, fromDate?: string, toDate?: string) {
    const now = new Date();
    const to = toDate ? new Date(toDate) : now;
    const from = fromDate ? new Date(fromDate) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dateFilter = { $gte: from, $lte: to };

    const waitlists = await this.waitListModel.find({ owner: userId }).select("+owner").lean();
    const waitlistIds = waitlists.map((w) => w._id);

    const baseMatch = { waitlistId: { $in: waitlistIds } };
    const rangeMatch = { ...baseMatch, createdAt: dateFilter };

    const [
      totalSignups,
      signupsInRange,
      statusCounts,
      sourceCounts,
      recentSignups,
      avgWaitDays,
    ] = await Promise.all([
      // Total signups across all waitlists (all time)
      this.waitListUserModel.countDocuments(baseMatch),

      // Signups in selected range
      this.waitListUserModel.countDocuments(rangeMatch),

      // Status breakdown (null/missing defaults to "waiting")
      this.waitListUserModel.aggregate([
        { $match: rangeMatch },
        { $group: { _id: { $ifNull: ["$status", "waiting"] }, count: { $sum: 1 } } },
      ]),

      // Source breakdown (null/missing defaults to "organic")
      this.waitListUserModel.aggregate([
        { $match: rangeMatch },
        {
          $group: {
            _id: { $ifNull: ["$source", "organic"] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Recent signups with waitlist name (within range)
      this.waitListUserModel.aggregate([
        { $match: rangeMatch },
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
            ...baseMatch,
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
    const newWaitlistsInRange = waitlists.filter(
      (w) =>
        w.isAvailable &&
        new Date((w as any).createdAt).getTime() >= from.getTime() &&
        new Date((w as any).createdAt).getTime() <= to.getTime(),
    ).length;

    // Calculate conversion rate (within range)
    const statusMap = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
    const convertedCount = statusMap["converted"] || 0;
    const rangeTotal = signupsInRange || 1;
    const conversionRate = rangeTotal > 0 ? (convertedCount / rangeTotal) * 100 : 0;

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
        change: signupsInRange,
      },
      activeWaitlists: {
        value: activeWaitlists,
        total: totalWaitlists,
        change: newWaitlistsInRange,
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
