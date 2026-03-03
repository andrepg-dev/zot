import { PartialType } from "@nestjs/swagger";
import { CreateUserQuoteDto } from "./create-userQuote.dto";

export class UpdateUserQuoteDto extends PartialType(CreateUserQuoteDto) {}
