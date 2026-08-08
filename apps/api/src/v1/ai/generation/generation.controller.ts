import { UserId } from "@api/src/common/decorators/user-id.decorator";
import type { MessageEvent } from "@nestjs/common";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Sse } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Observable } from "rxjs";
import { CreateGenerationEmailDto, EditEmailDto, GenerateEmailDto } from "./dto/generation.dto";
import { GenerationEmailsService } from "./generation-emails.service";
import { GenerationService } from "./generation.service";
import { listSkills } from "./skills.catalog";
import type { SkillDto } from "./variable-schema";

@Controller("ai/generation")
export class GenerationController {
  constructor(
    private readonly generation: GenerationService,
    private readonly emails: GenerationEmailsService,
  ) {}

  /** Catalog behind the composer's skill picker. Static content. */
  @Get("skills")
  skills(): SkillDto[] {
    return listSkills();
  }

  @Post("emails")
  create(@Body() data: CreateGenerationEmailDto, @UserId() userId: Types.ObjectId) {
    return this.emails.create(userId, data);
  }

  @Get("emails")
  list(@UserId() userId: Types.ObjectId) {
    return this.emails.list(userId);
  }

  @Get("emails/:id")
  findOne(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return this.emails.findOne(id, userId);
  }

  @Get("emails/:id/versions")
  versions(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return this.emails.versions(id, userId);
  }

  @Get("emails/:id/versions/:seq")
  version(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Param("seq", ParseIntPipe) seq: number,
    @UserId() userId: Types.ObjectId,
  ) {
    return this.emails.version(id, userId, seq);
  }

  @Get("emails/:id/chat")
  chat(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return this.emails.chat(id, userId);
  }

  @Delete("emails/:id")
  remove(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return this.emails.remove(id, userId);
  }

  /** Initial draft. Streams progress, tool activity and the finished variant. */
  @Post("emails/:id/generate")
  @Sse()
  generate(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
    @Body() data: GenerateEmailDto,
  ): Observable<MessageEvent> {
    return this.generation.generateEmailStream(id, userId, data);
  }

  /** Follow-up edit against the current variant. */
  @Post("emails/:id/edit")
  @Sse()
  edit(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
    @Body() data: EditEmailDto,
  ): Observable<MessageEvent> {
    return this.generation.editEmailStream(id, userId, data);
  }

  /** Re-run the last user turn as a sibling response. */
  @Post("emails/:id/regenerate")
  @Sse()
  regenerate(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ): Observable<MessageEvent> {
    return this.generation.regenerateEmailStream(id, userId);
  }
}
