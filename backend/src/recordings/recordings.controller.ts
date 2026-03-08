import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Req, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecordingsService } from './recordings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/recordings')
export class RecordingsController {
  constructor(private svc: RecordingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req:any, @Body() body:any){
    // expect file.buffer available
    const userId = req.user.sub;
    const lessonId = body.lessonId || null;
    const durationMs = Number(body.durationMs) || 0;
    if(!file || !file.buffer) throw new BadRequestException('No file')
    const rec = await this.svc.save({ userId, lessonId, data: file.buffer, durationMs });
    return { success:true, id: rec.id }
  }
}
