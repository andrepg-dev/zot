import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateEmailTemplateDto } from "./dto/create-email-template.dto";
import { UpdateEmailTemplateDto } from "./dto/update-email-template.dto";
import { EmailTemplatesService } from "./email-templates.service";

@Controller("email-templates")
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Post()
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.emailTemplatesService.create(createEmailTemplateDto);
  }

  @Get()
  findAll(@UserId() userId: string) {
    return this.emailTemplatesService.findAll(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.emailTemplatesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEmailTemplateDto: UpdateEmailTemplateDto) {
    return this.emailTemplatesService.update(+id, updateEmailTemplateDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.emailTemplatesService.remove(+id);
  }
}
