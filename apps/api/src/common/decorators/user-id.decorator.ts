import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from "@nestjs/common";
import { Types } from "mongoose";

/**
 * Extract userId value with custom decorator
 *
 * @returns Mongoose ObjectId
 */
export const UserId = createParamDecorator((data, ctx: ExecutionContext): Types.ObjectId => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = ctx.switchToHttp().getRequest();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const userId = request?.user?.userId as Types.ObjectId;

  if (!userId) {
    throw new InternalServerErrorException("User not authenticated");
  }

  return userId;
});
