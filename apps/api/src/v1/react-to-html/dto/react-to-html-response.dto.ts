import { ApiProperty } from "@nestjs/swagger";

export class ReactToHtmlResponseDto {
  @ApiProperty({
    description: "Compiled HTML output from React component",
    example: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head></head>
  <body>
    <div style="max-width:600px;margin:0 auto">
      <p>Hello World!</p>
    </div>
  </body>
</html>`,
  })
  html: string;
}
