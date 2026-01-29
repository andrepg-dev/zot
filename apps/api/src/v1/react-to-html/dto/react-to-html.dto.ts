import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReactToHtmlDto {
  @ApiProperty({
    description: "React component code to be compiled to HTML",
    example: `import { Html, Head, Body, Container, Text } from "@react-email/components";

export default function Email() {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hello World!</Text>
        </Container>
      </Body>
    </Html>
  );
}`,
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
