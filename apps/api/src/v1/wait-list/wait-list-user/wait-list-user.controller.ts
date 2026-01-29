import { Body, Controller, Delete, Get, Param, Post, Query, Request } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Public } from "../../auth/decorators/skip-auth.decorator";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";
import { WaitListUserService } from "./wait-list-user.service";

@Controller({ path: "wait-list/:waitlistId/users", version: "1" })
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
  async findAll(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;
    return await this.waitListUserService.findAll(waitlistId, userId);
  }

  @Get("count")
  async count(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;
    const total = await this.waitListUserService.count(waitlistId, userId);
    const referred = await this.waitListUserService.countReferred(waitlistId, userId);

    return { total, referred };
  }

  @Get("search")
  async findByEmail(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Query("email") email: string,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;
    return await this.waitListUserService.findByEmail(waitlistId, email, userId);
  }

  @Delete(":email")
  async remove(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Param("email") email: string,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;
    return await this.waitListUserService.remove(waitlistId, email, userId);
  }
}
