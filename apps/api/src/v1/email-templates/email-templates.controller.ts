import { UserId } from "@api/src/common/decorators/user-id.decorator";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Public } from "../auth/decorators/skip-auth.decorator";
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

  @Public()
  @Get("public")
  findPublic() {
    return this.emailTemplatesService.findPublic();
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
      throw new HttpException(
        `Template ${id.toString()} not found or you don't have permission to access it.`,
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        `Template ${id.toString()} not found or you don't have permission to update it.`,
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        `Template ${id.toString()} not found or you don't have permission to delete it.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return template;
  }
}
