import { S3Service } from "@api/src/v1/core/aws/s3/s3.service";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GenerationEmailVariant } from "./schemas/email-variant.schema";

export const MAX_EMAIL_VERSIONS = 20;
/**
 * Preview screenshots we keep per email. Only the newest variant's preview is
 * ever rendered, so anything older is dead weight in S3. We keep one spare for
 * the in-flight/just-superseded case.
 */
export const MAX_EMAIL_PREVIEWS = 2;

@Injectable()
export class EmailVariantRetentionService {
  private readonly logger = new Logger(EmailVariantRetentionService.name);

  constructor(
    @InjectModel(GenerationEmailVariant.name)
    private readonly variantModel: Model<GenerationEmailVariant>,
    private readonly s3: S3Service,
  ) {}

  /** Drop versions past the cap, then drop preview objects past the preview cap. */
  async prune(emailId: Types.ObjectId): Promise<number> {
    const deleted = await this.pruneVersions(emailId);
    await this.prunePreviews(emailId);
    return deleted;
  }

  /** Keep the newest versions and clean up their preview objects. */
  private async pruneVersions(emailId: Types.ObjectId): Promise<number> {
    const stale = await this.variantModel
      .find({ email: emailId })
      .sort({ seq: -1 })
      .skip(MAX_EMAIL_VERSIONS)
      .select({ _id: 1, previewUrl: 1 })
      .lean();
    if (stale.length === 0) return 0;

    const previewUrls = [
      ...new Set(stale.map((variant) => variant.previewUrl).filter((url): url is string => !!url)),
    ];

    const result = await this.variantModel.deleteMany({
      _id: { $in: stale.map((variant) => variant._id) },
    });

    const failures = await this.deleteObjects(previewUrls);
    if (failures > 0) {
      this.logger.warn(
        `Deleted ${result.deletedCount} old variants for ${emailId.toString()}, but ${failures} preview objects could not be removed.`,
      );
    }
    return result.deletedCount ?? 0;
  }

  /**
   * Drop preview screenshots for every variant older than the newest
   * MAX_EMAIL_PREVIEWS, keeping the variant rows so version history stays
   * navigable. The database is cleared first, so a failed S3 delete leaves a
   * harmless orphan object rather than a row pointing at a missing image.
   */
  private async prunePreviews(emailId: Types.ObjectId): Promise<number> {
    const stale = await this.variantModel
      .find({ email: emailId, previewUrl: { $ne: null } })
      .sort({ seq: -1 })
      .skip(MAX_EMAIL_PREVIEWS)
      .select({ _id: 1, previewUrl: 1 })
      .lean();
    if (stale.length === 0) return 0;

    const previewUrls = [
      ...new Set(stale.map((variant) => variant.previewUrl).filter((url): url is string => !!url)),
    ];

    await this.variantModel.updateMany(
      { _id: { $in: stale.map((variant) => variant._id) } },
      { $set: { previewUrl: null } },
    );

    // A newer variant may point at the same object (an unchanged re-save), so
    // only remove objects nothing references anymore.
    const stillReferenced = await this.variantModel
      .find({ previewUrl: { $in: previewUrls } })
      .select({ previewUrl: 1 })
      .lean();
    const protectedUrls = new Set(
      stillReferenced.map((variant) => variant.previewUrl).filter((url): url is string => !!url),
    );

    const removable = previewUrls.filter((url) => !protectedUrls.has(url));
    const failures = await this.deleteObjects(removable);
    if (failures > 0) {
      this.logger.warn(
        `Cleared ${stale.length} stale previews for ${emailId.toString()}, but ${failures} objects could not be removed.`,
      );
    }
    return removable.length;
  }

  /** Best-effort object removal; returns how many deletes failed. */
  private async deleteObjects(urls: string[]): Promise<number> {
    if (urls.length === 0) return 0;
    const results = await Promise.allSettled(urls.map((url) => this.s3.deletePublicUrl(url)));
    return results.filter((result) => result.status === "rejected").length;
  }
}
