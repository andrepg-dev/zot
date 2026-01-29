import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

/**
 * Extract userId value with custom decorator
 *
 * @returns { userId: string }
 */
export const UserId = createParamDecorator((ctx: ExecutionContext): { userId: string } => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = ctx.switchToHttp().getRequest();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const userId = request?.user?.userId as { userId: string };

  if (!userId) {
    throw new UnauthorizedException("User not authenticated");
  }

  return userId;
});
