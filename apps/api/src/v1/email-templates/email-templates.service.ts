import { handleDatabaseErrors } from "@api/src/common/error-handling/handle-database-errors";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateEmailTemplateDto } from "./dto/create-email-template.dto";
import { UpdateEmailTemplateDto } from "./dto/update-email-template.dto";
import { EmailTemplate } from "./schemas/email-template.schema";

@Injectable()
export class EmailTemplatesService {
  constructor(@InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>) {}

  async create(createEmailTemplateDto: CreateEmailTemplateDto, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.create({
        ...createEmailTemplateDto,
        owner,
      });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findAll(owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.find({ owner });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findOne(id: number, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.findOne({ id, owner });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async update(id: number, updateEmailTemplateDto: UpdateEmailTemplateDto, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.updateOne({ id, owner }, updateEmailTemplateDto);
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async remove(id: number, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.findOneAndDelete({ id, owner });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }
}
