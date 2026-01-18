import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitListService } from "./wait-list.service";

@Controller("wait-list")
export class WaitListController {
  constructor(private readonly waitListService: WaitListService) {}

  @Post()
  create(@Body() createWaitListDto: CreateWaitListDto) {
    return this.waitListService.create(createWaitListDto);
  }

  @Get()
  findAll() {
    return this.waitListService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.waitListService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateWaitListDto: UpdateWaitListDto,
  ) {
    return this.waitListService.update(id, updateWaitListDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.waitListService.remove(id);
  }
}
