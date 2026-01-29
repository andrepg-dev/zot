import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

/**
 * Extract userId value with custom decorator
 *
 * @returns "userId"
 */
export const UserId = createParamDecorator((ctx: ExecutionContext): string => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = ctx.switchToHttp().getRequest();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const userId = request?.user?.userId as string;

  if (!userId) {
    throw new UnauthorizedException("User not authenticated");
  }

  return userId;
});
