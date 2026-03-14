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
import { ApiKeyService } from "./api-key.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";

@ApiTags("API Keys")
@ApiBearerAuth("JWT-auth")
@Controller({ path: "api-key", version: "1" })
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new API key",
    description: "Creates a new API key for the authenticated user.",
  })
  @ApiCreatedResponse({ description: "API key created successfully" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async create(@Body() createApiKeyDto: CreateApiKeyDto, @UserId() userId: Types.ObjectId) {
    return await this.apiKeyService.create(createApiKeyDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: "Get all API keys",
    description: "Retrieves all API keys owned by the authenticated user.",
  })
  @ApiOkResponse({ description: "List of API keys retrieved successfully" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async findAll(@UserId() userId: Types.ObjectId) {
    return await this.apiKeyService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a specific API key",
    description: "Retrieves a specific API key by ID.",
  })
  @ApiParam({
    name: "id",
    description: "API key MongoDB ObjectId",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({ description: "API key retrieved successfully" })
  @ApiNotFoundResponse({ description: "API key not found" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async findOne(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.apiKeyService.findOne(id, userId);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update an API key",
    description: "Updates an existing API key. Only the owner can update.",
  })
  @ApiParam({
    name: "id",
    description: "API key MongoDB ObjectId",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({ description: "API key updated successfully" })
  @ApiNotFoundResponse({ description: "API key not found" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async update(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.apiKeyService.update(id, updateApiKeyDto, userId);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete an API key",
    description: "Permanently deletes an API key. This action cannot be undone.",
  })
  @ApiParam({
    name: "id",
    description: "API key MongoDB ObjectId",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiOkResponse({ description: "API key deleted successfully" })
  @ApiNotFoundResponse({ description: "API key not found" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  async remove(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.apiKeyService.remove(id, userId);
  }
}
