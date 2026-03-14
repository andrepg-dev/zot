import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import express from "express";
import { Public } from "./v1/auth/decorators/skip-auth.decorator";
import { ApiKeyGuard } from "./v1/auth/guards/api-key.guard";

@ApiTags("Health")
@Controller("/")
export class AppController {
  @Public()
  @UseGuards(ApiKeyGuard)
  @Get()
  @ApiOperation({
    summary: "Health check",
    description: "Returns a welcome message. Use this endpoint to verify the API is running.",
  })
  @ApiOkResponse({
    description: "API is healthy and running",
    schema: {
      type: "string",
      example: "Welcome to zot API",
    },
  })
  main(@Req() req: express.Request) {
    return req.user;
  }
}
