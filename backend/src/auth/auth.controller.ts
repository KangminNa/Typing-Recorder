import { Controller, Post, Body, HttpException, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      const user = await this.auth.register(body);
      const token = await this.auth.login(user as any);
      return { success: true, user, token };
    } catch (e:any) {
      throw new HttpException(e.message || 'Register failed', 400);
    }
  }

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) throw new HttpException('Invalid credentials', 401);
    const token = await this.auth.login(user);
    return { success: true, user, token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req:any){
    const u = await this.users.findById(req.user.sub);
    const { passwordHash, ...rest } = u as any;
    return { success: true, user: rest };
  }
}
