import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { EmailChatMessage } from "./schemas/email-chat-message.schema";
import { GenerationEmailVariant } from "./schemas/email-variant.schema";
import { GenerationEmail } from "./schemas/generation-email.schema";

/**
 * CRUD around generated email projects. The generation run itself lives in
 * GenerationService; this covers everything the editor needs to load and list
 * work that already exists.
 */
@Injectable()
export class GenerationEmailsService {
  constructor(
    @InjectModel(GenerationEmail.name)
    private readonly emailModel: Model<GenerationEmail>,
    @InjectModel(GenerationEmailVariant.name)
    private readonly variantModel: Model<GenerationEmailVariant>,
    @InjectModel(EmailChatMessage.name)
    private readonly chatModel: Model<EmailChatMessage>,
  ) {}

  /**
   * Start a project from a brief. The brief is stored both on the email and as
   * the first USER chat row, so the editor timeline reads correctly before the
   * first generation has run.
   */
  async create(
    owner: Types.ObjectId,
    data: { prompt: string; imageUrls?: string[]; skills?: string[] },
  ) {
    const email = await this.emailModel.create({
      owner,
      prompt: data.prompt,
      title: data.prompt.slice(0, 80),
      status: "draft",
    });

    await this.chatModel.create({
      owner,
      email: email._id,
      role: "USER",
      kind: "TEXT",
      content: data.prompt,
      imageUrls: data.imageUrls ?? [],
      skills: data.skills ?? [],
    });

    return email;
  }

  async list(owner: Types.ObjectId) {
    return this.emailModel.find({ owner }).sort({ updatedAt: -1 }).lean();
  }

  /** Project with its newest variant, for opening the editor. */
  async findOne(emailId: Types.ObjectId, owner: Types.ObjectId) {
    const email = await this.emailModel.findOne({ _id: emailId, owner }).lean();
    if (!email) throw new NotFoundException("Email not found.");

    const variant = await this.variantModel
      .findOne({ email: emailId })
      .sort({ seq: -1 })
      .lean();

    return { ...email, variant: variant ?? null };
  }

  /** Retained versions, newest first. */
  async versions(emailId: Types.ObjectId, owner: Types.ObjectId) {
    await this.assertOwned(emailId, owner);
    return this.variantModel
      .find({ email: emailId })
      .sort({ seq: -1 })
      .select({ seq: 1, subject: 1, previewUrl: 1, createdAt: 1 })
      .lean();
  }

  /** One retained version in full, for previewing or restoring it. */
  async version(emailId: Types.ObjectId, owner: Types.ObjectId, seq: number) {
    await this.assertOwned(emailId, owner);
    const variant = await this.variantModel.findOne({ email: emailId, seq }).lean();
    if (!variant) throw new NotFoundException(`Version ${seq} is not retained.`);
    return variant;
  }

  async chat(emailId: Types.ObjectId, owner: Types.ObjectId) {
    await this.assertOwned(emailId, owner);
    return this.chatModel.find({ email: emailId }).sort({ createdAt: 1 }).lean();
  }

  /** Rename a project from the chats list. */
  async update(emailId: Types.ObjectId, owner: Types.ObjectId, data: { title?: string }) {
    const email = await this.emailModel.findOneAndUpdate(
      { _id: emailId, owner },
      { $set: data },
      { new: true }
    );

    if (!email) throw new NotFoundException("Email not found.");

    return email;
  }

  async remove(emailId: Types.ObjectId, owner: Types.ObjectId) {
    const email = await this.emailModel.findOneAndDelete({ _id: emailId, owner });
    if (!email) throw new NotFoundException("Email not found.");

    await Promise.all([
      this.variantModel.deleteMany({ email: emailId }),
      this.chatModel.deleteMany({ email: emailId }),
    ]);

    return { deleted: true };
  }

  private async assertOwned(emailId: Types.ObjectId, owner: Types.ObjectId) {
    const exists = await this.emailModel.exists({ _id: emailId, owner });
    if (!exists) throw new NotFoundException("Email not found.");
  }
}
