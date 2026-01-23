import { Public } from "@api/src/auth/decorators/skip-auth.decorator";
import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";
import { WaitListUserService } from "./wait-list-user.service";

@Controller("wait-list/:waitlistId/users")
export class WaitListUserController {
  constructor(private readonly waitListUserService: WaitListUserService) {}

  @Public()
  @Post()
  async register(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Body() dto: RegisterWaitListUserDto,
  ) {
    return await this.waitListUserService.register(waitlistId, dto);
  }

  @Get()
  async findAll(@Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId) {
    return await this.waitListUserService.findAll(waitlistId);
  }

  @Get("count")
  async count(@Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId) {
    const total = await this.waitListUserService.count(waitlistId);
    const referred = await this.waitListUserService.countReferred(waitlistId);

    return { total, referred };
  }

  @Get("search")
  async findByEmail(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Query("email") email: string,
  ) {
    return await this.waitListUserService.findByEmail(waitlistId, email);
  }

  @Delete(":email")
  async remove(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Param("email") email: string,
  ) {
    return await this.waitListUserService.remove(waitlistId, email);
  }
}
