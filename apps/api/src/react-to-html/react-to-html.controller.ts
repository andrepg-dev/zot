import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../auth/decorators/skip-auth.decorator";
import { ReactToHtmlService } from "../core/react-to-html/react-to-html.service";
import { ReactToHtmlDto } from "./dto/react-to-html.dto";

@Controller("react2html")
export class ReactToHtmlController {
  constructor(private react2html: ReactToHtmlService) {}

  @Public()
  @Post()
  async compile(@Body() body: ReactToHtmlDto) {
    const code = body.code;
    const result = await this.react2html.compile(code);
    return result;
  }
}
