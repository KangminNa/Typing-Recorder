import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TypingService } from './typing.service';

@Controller('api/typing')
export class TypingController {
  constructor(private service: TypingService) {}

  @Post('result')
  async postResult(@Body() body: any) {
    // expect: { name, wpm, accuracy, errors, durationMs, text }
    const saved = await this.service.save(body);
    return { success: true, id: saved.id };
  }

  @Get('leaderboard')
  async leaderboard(@Query('limit') limit?: string) {
    const l = limit ? Number(limit) : 20;
    const rows = await this.service.list(l);
    return { success: true, rows };
  }
}
