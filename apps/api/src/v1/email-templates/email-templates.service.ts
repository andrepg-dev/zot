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

  async findOne(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.findOne({ _id: id, owner });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async update(
    id: Types.ObjectId,
    updateEmailTemplateDto: UpdateEmailTemplateDto,
    owner: Types.ObjectId,
  ) {
    try {
      return await this.EmailTemplateModel.findOneAndUpdate(
        { _id: id, owner },
        updateEmailTemplateDto,
      );
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async remove(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.findOneAndDelete({ _id: id, owner });
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }
}
