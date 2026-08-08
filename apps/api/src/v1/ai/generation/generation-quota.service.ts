import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GenerationRun } from "./schemas/generation-run.schema";

/**
 * Daily cap on AI generations per user.
 *
 * Madoo meters generations against a per-plan credit pool. Zot has no plan
 * limits yet, so this is a deliberately simpler gate over the same idea: a flat
 * per-user daily cap that keeps a runaway loop or a scripted client from
 * running up unbounded Anthropic spend. Set GENERATION_DAILY_LIMIT to -1 to
 * disable, or raise it per deployment.
 */
const DEFAULT_DAILY_LIMIT = 50;

@Injectable()
export class GenerationQuotaService {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(GenerationRun.name)
    private readonly runModel: Model<GenerationRun>,
  ) {}

  private dailyLimit(): number {
    const raw = this.config.get<string>("GENERATION_DAILY_LIMIT");
    const parsed = raw === undefined ? DEFAULT_DAILY_LIMIT : Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : DEFAULT_DAILY_LIMIT;
  }

  /** Throws when the caller has spent their generations for the UTC day. */
  async assertCanGenerate(owner: Types.ObjectId): Promise<void> {
    const limit = this.dailyLimit();
    if (limit === -1) return;

    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);

    const usedToday = await this.runModel.countDocuments({
      owner,
      createdAt: { $gte: dayStart },
    });

    if (usedToday >= limit) {
      throw new ForbiddenException(
        `Daily AI generation limit reached (${usedToday}/${limit}). Resets at 00:00 UTC.`,
      );
    }
  }
}
