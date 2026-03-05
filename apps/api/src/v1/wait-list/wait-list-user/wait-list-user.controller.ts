import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { Public } from "../../auth/decorators/skip-auth.decorator";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";
import {
  WaitListUserCountResponseDto,
  WaitListUserResponseDto,
} from "./dto/wait-list-user-response.dto";
import { WaitListUserService } from "./wait-list-user.service";

@ApiTags("WaitList Users")
@ApiParam({
  name: "waitlistId",
  description: "Waitlist MongoDB ObjectId",
  example: "507f1f77bcf86cd799439011",
})
@Controller({ path: "wait-list/:waitlistId/user", version: "1" })
export class WaitListUserController {
  constructor(private readonly waitListUserService: WaitListUserService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: "Register for a waitlist",
    description:
      "Allows a user to register for a waitlist. This is a public endpoint that does not require authentication.",
  })
  @ApiCreatedResponse({
    description: "User successfully registered to waitlist",
    type: WaitListUserResponseDto,
  })
  @ApiNotFoundResponse({ description: "Waitlist not found or not available" })
  async register(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Body() dto: RegisterWaitListUserDto,
  ) {
    return await this.waitListUserService.register(waitlistId, dto);
  }

  @Get()
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all waitlist users",
    description:
      "Retrieves all users registered in a specific waitlist. Requires owner authentication.",
  })
  @ApiOkResponse({
    description: "List of waitlist users retrieved successfully",
    type: [WaitListUserResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Not authenticated or not the waitlist owner" })
  async findAll(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.waitListUserService.findAll(waitlistId, userId);
  }

  @Get("count")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get waitlist user counts",
    description: "Returns total user count and referred user count for a waitlist.",
  })
  @ApiOkResponse({
    description: "Waitlist counts retrieved successfully",
    type: WaitListUserCountResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Not authenticated or not the waitlist owner" })
  async count(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    const total = await this.waitListUserService.count(waitlistId, userId);
    const referred = await this.waitListUserService.countReferred(waitlistId, userId);

    return { total, referred };
  }

  @Get("search")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Search user by email",
    description: "Finds a specific user in the waitlist by their email address.",
  })
  @ApiQuery({
    name: "email",
    description: "Email address to search for",
    example: "user@example.com",
    required: true,
  })
  @ApiOkResponse({
    description: "User found",
    type: WaitListUserResponseDto,
  })
  @ApiNotFoundResponse({ description: "User not found in waitlist" })
  @ApiUnauthorizedResponse({ description: "Not authenticated or not the waitlist owner" })
  async findByEmail(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Query("email") email: string,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.waitListUserService.findByEmail(waitlistId, email, userId);
  }

  @Delete(":email")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Remove user from waitlist",
    description: "Removes a user from the waitlist by their email address.",
  })
  @ApiParam({
    name: "email",
    description: "Email address of the user to remove",
    example: "user@example.com",
  })
  @ApiOkResponse({ description: "User removed from waitlist successfully" })
  @ApiNotFoundResponse({ description: "User not found in waitlist" })
  @ApiUnauthorizedResponse({ description: "Not authenticated or not the waitlist owner" })
  async remove(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @Param("email") email: string,
    @UserId() userId: Types.ObjectId,
  ) {
    return await this.waitListUserService.remove(waitlistId, email, userId);
  }
}
