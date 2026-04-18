import { UserId } from "@api/src/common/decorators/user-id.decorator";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
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
import { EmailSecurityService } from "../../core/email-security/email-security.service";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";
import { UpdateWaitListUserStatusDto } from "./dto/update-wait-list-user-status.dto";
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
  constructor(
    private readonly waitListUserService: WaitListUserService,
    private readonly emailSecurityService: EmailSecurityService,
  ) {}

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

  @Get("blocked")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get blocked users",
    description: "Retrieves all blocked (fake) users for a specific waitlist.",
  })
  @ApiOkResponse({ description: "List of blocked users retrieved successfully" })
  @ApiUnauthorizedResponse({ description: "Not authenticated or not the waitlist owner" })
  async findAllBlocked(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    await this.waitListUserService.validateOwnership(waitlistId, userId);
    return await this.emailSecurityService.findAllByWaitlist(waitlistId);
  }

  @Get("blocked/count")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get blocked users count",
    description: "Returns the total count of blocked users for a waitlist.",
  })
  @ApiOkResponse({ description: "Blocked users count retrieved successfully" })
  @ApiUnauthorizedResponse({ description: "Not authenticated or not the waitlist owner" })
  async countBlocked(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
  ) {
    await this.waitListUserService.validateOwnership(waitlistId, userId);
    const total = await this.emailSecurityService.countByWaitlist(waitlistId);
    return { total };
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

  @Patch("status")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Update user status",
    description:
      "Updates the status of a waitlist user (waiting, invited, converted, churned). Use this to track user progression through the waitlist funnel.",
  })
  @ApiOkResponse({ description: "User status updated successfully" })
  @ApiNotFoundResponse({ description: "User not found in waitlist" })
  @ApiUnauthorizedResponse({ description: "Not authenticated or not the waitlist owner" })
  async updateStatus(
    @Param("waitlistId", ParseObjectIdPipe) waitlistId: Types.ObjectId,
    @UserId() userId: Types.ObjectId,
    @Body() dto: UpdateWaitListUserStatusDto,
  ) {
    return await this.waitListUserService.updateStatus(waitlistId, dto.email, dto.status, userId);
  }

  @Post("bulk-delete")
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
    @UserId() userId: Types.ObjectId,
    @Body() emails: Array<string> | string,
  ) {
    let emailsToSend = emails;

    if (typeof emailsToSend === "string") {
      emailsToSend = emailsToSend.split(" ");
    }

    return await this.waitListUserService.remove(waitlistId, emailsToSend, userId);
  }
}
