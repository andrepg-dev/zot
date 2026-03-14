import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/skip-auth.decorator";
import { ApiKeyGuard } from "./api-key.guard";
import { JwtAuthGuard } from "./jwt.guard";

@Injectable()
export class CompositeAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtGuard: JwtAuthGuard,
    private apikeyguard: ApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      // Only this is needeed
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    try {
      return (await Promise.resolve(this.jwtGuard.canActivate(context))) as boolean;
    } catch {
      /* empty */
    }

    try {
      return (await Promise.resolve(this.apikeyguard.canActivate(context))) as boolean;
    } catch {
      /* Empty */
    }
    throw new UnauthorizedException();
  }
}
