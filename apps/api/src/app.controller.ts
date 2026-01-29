import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "./v1/auth/decorators/skip-auth.decorator";

@ApiTags("Health")
@Controller("/")
export class AppController {
  @Public()
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
  main() {
    return "Welcome to zot API";
  }
}
