import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class ReactToHtmlDto {
  @ApiProperty({
    description: "React component code to be compiled to HTML",
    example: `const Email = ({ recipientName = "there" } = {}) => (
  <Html>
    <Head />
    <Body>
      <Container>
        <Text>Hello {recipientName}!</Text>
      </Container>
    </Body>
  </Html>
);`,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: "Variables (props) to inject into the component at render time.",
    example: { recipientName: "John", brandName: "Acme" },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  variables?: Record<string, unknown>;
}
