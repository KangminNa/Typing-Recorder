import { Injectable, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    if (!auth) throw new UnauthorizedException();
    const parts = String(auth).split(' ');
    if (parts.length !== 2) throw new UnauthorizedException();
    const token = parts[1];
    try {
      const payload = this.jwt.verify(token);
      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
