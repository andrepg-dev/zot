import { InternalServerErrorException } from "@nestjs/common";

export function handleDatabaseErrors(error: any) {
  throw new InternalServerErrorException(`Error saving on database: ${error}`);
}
