import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ReactToHtmlService } from "../core/react-to-html/react-to-html.service";
import { UserQuoteService } from "../users/user-quote/user-quote.service";
import { CreateEmailTemplateDto } from "./dto/create-email-template.dto";
import { UpdateEmailTemplateDto } from "./dto/update-email-template.dto";
import { EmailTemplate } from "./schemas/email-template.schema";

@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>,
    private readonly reactToHtmlService: ReactToHtmlService,
    private readonly userQuoteService: UserQuoteService,
  ) {}

  async create(createEmailTemplateDto: CreateEmailTemplateDto, owner: Types.ObjectId) {
    try {
      await this.userQuoteService.editUserQuote({
        ownerId: owner,
        service: "emailsTemplates",
        usage: 1,
      });

      return await this.EmailTemplateModel.create({
        ...createEmailTemplateDto,
        html: await this.reactToHtmlService.compile(createEmailTemplateDto.code),
        owner,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error creating email template.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.find({ owner }).sort({ createdAt: -1 });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching email templates.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      const template = await this.EmailTemplateModel.findOne({ _id: id, owner });
      if (!template) {
        throw new HttpException(
          `Template ${id.toString()} not found or you don't have permission to access it.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return template;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching email template.", HttpStatus.INTERNAL_SERVER_ERROR);
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
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error updating email template.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.findOneAndDelete({ _id: id, owner });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error deleting email template.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
