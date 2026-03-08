import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private roles: string[] = []) {}
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;
    if (this.roles.length === 0) return true;
    if (this.roles.includes(user.role)) return true;
    throw new ForbiddenException('Insufficient role');
  }
}
