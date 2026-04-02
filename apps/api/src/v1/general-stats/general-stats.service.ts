import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { WaitListUserService } from "../wait-list/wait-list-user/wait-list-user.service";

@Injectable()
export class GeneralStatsService {
  constructor(private readonly waitlist: WaitListUserService) {}

  async getGeneralStats(userId: Types.ObjectId) {
    const [signupsByDay] = await Promise.all([
      this.waitlist.getAllUsersBasedOnOwner(userId, [
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]),
    ]);

    return {
      signupsByDay,
    };
  }
}
