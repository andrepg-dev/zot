import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReactToHtmlService } from "../core/react-to-html/react-to-html.service";
import { ReactToHtmlResponseDto } from "./dto/react-to-html-response.dto";
import { ReactToHtmlDto } from "./dto/react-to-html.dto";

@ApiTags("React to HTML")
@Controller({ path: "react2html", version: "1" })
export class ReactToHtmlController {
  constructor(private react2html: ReactToHtmlService) {}

  @Post()
  @ApiOperation({
    summary: "Compile React to HTML",
    description: `Compiles React email components to static HTML. 
    
This endpoint is useful for generating email templates using React Email components.
The input should be valid React/JSX code that exports a default component.

**Supported packages:**
- @react-email/components (Html, Head, Body, Container, Text, Button, etc.)`,
  })
  @ApiOkResponse({
    description: "React component successfully compiled to HTML",
    type: ReactToHtmlResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid React code or compilation error",
  })
  async compile(@Body() body: ReactToHtmlDto) {
    const code = body.code;
    const result = await this.react2html.compile(code);

    return { html: result };
  }
}
