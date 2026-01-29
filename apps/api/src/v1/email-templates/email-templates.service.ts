import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateEmailTemplateDto } from "./dto/create-email-template.dto";
import { UpdateEmailTemplateDto } from "./dto/update-email-template.dto";
import { EmailTemplate } from "./schemas/email-template.schema";

@Injectable()
export class EmailTemplatesService {
  constructor(@InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>) {}

  create(createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.EmailTemplateModel.create(createEmailTemplateDto);
  }

  findAll(owner: string) {
    return this.EmailTemplateModel.find({ owner });
  }

  findOne(id: number, owner: string) {
    return this.EmailTemplateModel.findOne({ id, owner });
  }

  update(id: number, updateEmailTemplateDto: UpdateEmailTemplateDto) {
    return `This action updates a #${id} emailTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} emailTemplate`;
  }
}
