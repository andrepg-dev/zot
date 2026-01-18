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
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitListService } from "./wait-list.service";

@Controller("wait-list")
export class WaitListController {
  constructor(private readonly waitListService: WaitListService) {}

  @Post()
  async reate(@Body() createWaitListDto: CreateWaitListDto) {
    return await this.waitListService.create(createWaitListDto);
  }

  @Get()
  async findAll() {
    return await this.waitListService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
    const response = await this.waitListService.findOne(id);

    if (!response) {
      throw new NotFoundException(`WaitList ${id} not found`);
    }

    return response;
  }

  @Patch(":id")
  async update(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateWaitListDto: UpdateWaitListDto,
  ) {
    return await this.waitListService.update(id, updateWaitListDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
    return await this.waitListService.remove(id);
  }
}
