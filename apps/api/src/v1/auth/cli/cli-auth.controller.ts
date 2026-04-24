import { UserId } from "@api/src/common/decorators/user-id.decorator";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Types } from "mongoose";

import { Public } from "../decorators/skip-auth.decorator";
import { CliAuthService } from "./cli-auth.service";
import { ApproveCliSessionDto, DenyCliSessionDto } from "./dto/approve.dto";
import { PollCliSessionDto, PollCliSessionResponseDto } from "./dto/poll.dto";
import { StartCliSessionDto, StartCliSessionResponseDto } from "./dto/start.dto";

@ApiTags("CLI Auth")
@Controller({ path: "auth/cli", version: "1" })
export class CliAuthController {
  constructor(private readonly cliAuthService: CliAuthService) {}

  @Public()
  @Post("start")
  @ApiOperation({
    summary: "Start a CLI device authorization session.",
    description:
      "Called by the CLI. Returns a device code (used for polling), a verification URL to open in the browser, and a short user code used as fallback.",
  })
  @ApiOkResponse({ type: StartCliSessionResponseDto })
  async start(@Body() dto: StartCliSessionDto): Promise<StartCliSessionResponseDto> {
    return this.cliAuthService.start(dto.clientName);
  }

  @Get("session/by-token/:sessionToken")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Fetch a pending CLI session (browser-side, authorize page).",
  })
  @ApiParam({ name: "sessionToken", description: "64-char hex session token." })
  async getByToken(@Param("sessionToken") sessionToken: string) {
    return this.cliAuthService.getApprovalView({ sessionToken });
  }

  @Get("session/by-code/:userCode")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Fetch a pending CLI session by its user code (manual entry fallback).",
  })
  @ApiParam({ name: "userCode", description: "Short user code, format XXXX-XXXX." })
  async getByCode(@Param("userCode") userCode: string) {
    return this.cliAuthService.getApprovalView({ userCode });
  }

  @Post("approve")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Approve a CLI session and issue an API key.",
  })
  async approve(
    @Body() dto: ApproveCliSessionDto,
    @UserId() userId: Types.ObjectId,
  ) {
    if (!dto.sessionToken && !dto.userCode) {
      throw new BadRequestException("sessionToken or userCode is required.");
    }
    return this.cliAuthService.approve(
      { sessionToken: dto.sessionToken, userCode: dto.userCode },
      userId,
      dto.apiKeyName,
    );
  }

  @Post("deny")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Deny a pending CLI session." })
  async deny(@Body() dto: DenyCliSessionDto, @UserId() userId: Types.ObjectId) {
    if (!dto.sessionToken && !dto.userCode) {
      throw new BadRequestException("sessionToken or userCode is required.");
    }
    return this.cliAuthService.deny(
      { sessionToken: dto.sessionToken, userCode: dto.userCode },
      userId,
    );
  }

  @Public()
  @Post("poll")
  @ApiOperation({
    summary: "Poll the status of a CLI session (called by the CLI).",
  })
  @ApiOkResponse({ type: PollCliSessionResponseDto })
  async poll(@Body() dto: PollCliSessionDto): Promise<PollCliSessionResponseDto> {
    return this.cliAuthService.poll(dto.deviceCode);
  }
}
