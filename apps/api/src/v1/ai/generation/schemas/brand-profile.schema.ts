import { BasedOwnerSchema } from "@api/src/common/schemas/based-owner.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

/**
 * Brand kit persisted from the last inspected website, reused as visual
 * direction on later generations so the user does not re-paste their URL.
 */
@Schema({ timestamps: true, versionKey: false, collection: "generation_brand_profiles" })
export class BrandProfile extends BasedOwnerSchema {
  @Prop({ required: true })
  url: string;

  @Prop({ type: String, default: null })
  brandName: string | null;

  @Prop({ type: String, default: null })
  logoUrl: string | null;

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop({ type: [String], default: [] })
  fonts: string[];

  @Prop({ type: String, default: null })
  copyTone: string | null;

  @Prop({ type: [String], default: [] })
  imageUrls: string[];
}

export const BrandProfileSchema = SchemaFactory.createForClass(BrandProfile);

// `owner` is already indexed by BasedOwnerSchema. Redeclaring it here as unique
// conflicts with that definition, so the one profile per user rule is kept by
// always upserting on { owner } instead.
