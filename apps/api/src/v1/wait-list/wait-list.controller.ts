import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitListResponseDto } from "./dto/wait-list-response.dto";
import { WaitListService } from "./wait-list.service";

@ApiTags("WaitList")
@ApiBearerAuth("JWT-auth")
@Controller({ path: "wait-list", version: "1" })
export class WaitListController {
  constructor(private readonly waitListService: WaitListService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new waitlist",
    description: "Creates a new waitlist for the authenticated user.",
  })
  @ApiCreatedResponse({
    description: "Waitlist created successfully",
    type: WaitListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async create(@Body() createWaitListDto: CreateWaitListDto, @UserId() userId: Types.ObjectId) {
    return await this.waitListService.create(createWaitListDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: "Get all waitlists",
    description: "Retrieves all waitlists owned by the authenticated user.",
  })
  @ApiOkResponse({
    description: "List of waitlists retrieved successfully",
    type: [WaitListResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async findAll(@UserId() userId: Types.ObjectId) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.waitListService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a specific waitlist",
    description: "Retrieves a specific waitlist by ID.",
  })
  @ApiParam({
    name: "id",
    description: "Waitlist MongoDB ObjectId",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({
    description: "Waitlist retrieved successfully",
    type: WaitListResponseDto,
  })
  @ApiNotFoundResponse({ description: "Waitlist not found" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async findOne(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    const waitlist = await this.waitListService.findOne(id, userId);
    return waitlist;
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update a waitlist",
    description: "Updates an existing waitlist. Only the owner can update.",
  })
  @ApiParam({
    name: "id",
    description: "Waitlist MongoDB ObjectId",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({
    description: "Waitlist updated successfully",
    type: WaitListResponseDto,
  })
  @ApiNotFoundResponse({ description: "Waitlist not found" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async update(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateWaitListDto: UpdateWaitListDto,
    @UserId() userId: Types.ObjectId,
  ) {
    const waitlist = await this.waitListService.update(id, updateWaitListDto, userId);
    return waitlist;
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a waitlist",
    description: "Permanently deletes a waitlist. This action cannot be undone.",
  })
  @ApiParam({
    name: "id",
    description: "Waitlist MongoDB ObjectId",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({ description: "Waitlist deleted successfully" })
  @ApiNotFoundResponse({ description: "Waitlist not found" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async remove(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    const waitlist = await this.waitListService.remove(id, userId);
    return waitlist;
  }
}
