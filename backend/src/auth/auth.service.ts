import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;
    const matched = await bcrypt.compare(pass, user.passwordHash);
    if (matched) {
      // omit passwordHash
      const { passwordHash, ...rest } = user as any;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwt.sign(payload) };
  }

  async register(dto: { email: string; password: string; name?: string }) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new Error('Email exists');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);
    const user = await this.users.create({ email: dto.email, name: dto.name || '', passwordHash: hash });
    const { passwordHash, ...rest } = user as any;
    return rest;
  }
}
