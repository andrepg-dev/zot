import { UserId } from "@api/src/common/decorators/user-id.decorator";
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { CreateEmailTemplateDto } from "./dto/create-email-template.dto";
import { UpdateEmailTemplateDto } from "./dto/update-email-template.dto";
import { EmailTemplatesService } from "./email-templates.service";

@Controller("email-templates")
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Post()
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto, @UserId() userId: Types.ObjectId) {
    return this.emailTemplatesService.create(createEmailTemplateDto, userId);
  }

  @Get()
  findAll(@UserId() userId: Types.ObjectId) {
    return this.emailTemplatesService.findAll(userId);
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    const template = await this.emailTemplatesService.findOne(id, userId);

    if (!template) {
      throw new NotFoundException(`Template ${id.toString()} not found.`);
    }

    return template;
  }

  @Patch(":id")
  async update(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
    @UserId() userId: Types.ObjectId,
  ) {
    const template = await this.emailTemplatesService.update(id, updateEmailTemplateDto, userId);

    if (!template) {
      throw new NotFoundException(`Template ${id.toString()} not found.`);
    }

    return template;
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    const template = await this.emailTemplatesService.remove(id, userId);

    if (!template) {
      throw new NotFoundException(`Template ${id.toString()} not found.`);
    }

    return template;
  }
}
