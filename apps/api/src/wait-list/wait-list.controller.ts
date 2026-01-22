import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
} from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitListService } from "./wait-list.service";

@Controller("wait-list")
export class WaitListController {
  constructor(private readonly waitListService: WaitListService) {}

  @Post()
  async create(
    @Body() createWaitListDto: CreateWaitListDto,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;

    return await this.waitListService.create(createWaitListDto, userId);
  }

  @Get()
  async findAll(@Request() req: Express.Request) {
    const userId = req?.user?.userId;

    return await this.waitListService.findAll(userId);
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;
    const response = await this.waitListService.findOne(id, userId);

    if (!response) {
      throw new NotFoundException(`WaitList ${String(id)} not found`);
    }

    return response;
  }

  @Patch(":id")
  async update(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateWaitListDto: UpdateWaitListDto,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;
    return await this.waitListService.update(id, updateWaitListDto, userId);
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Request() req: Express.Request,
  ) {
    const userId = req?.user?.userId;
    return await this.waitListService.remove(id, userId);
  }
}
