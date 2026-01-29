import { PartialType } from "@nestjs/swagger";
import { CreateWaitListDto } from "./create-wait-list.dto";

export class UpdateWaitListDto extends PartialType(CreateWaitListDto) {}
