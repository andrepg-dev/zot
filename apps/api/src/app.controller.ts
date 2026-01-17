import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class AppController {
  @Get()
  main() {
    return "Welcome to zot API";
  }
}
