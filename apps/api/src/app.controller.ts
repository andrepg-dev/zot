import { Controller, Get } from "@nestjs/common";
import { Public } from "./auth/decorators/skip-auth.decorator";

@Controller("/")
export class AppController {
  @Public()
  @Get()
  main() {
    return "Welcome to zot API";
  }
}
