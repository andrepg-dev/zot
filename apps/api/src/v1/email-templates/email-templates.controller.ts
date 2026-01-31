import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
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
  findOne(@Param("id") id: string, @UserId() userId: Types.ObjectId) {
    return this.emailTemplatesService.findOne(+id, userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
    @UserId() userId: Types.ObjectId,
  ) {
    return this.emailTemplatesService.update(+id, updateEmailTemplateDto, userId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @UserId() userId: Types.ObjectId) {
    return this.emailTemplatesService.remove(+id, userId);
  }
}
