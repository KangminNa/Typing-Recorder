import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Req, Body, Get, Param, Res, BadRequestException } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req:any){
    // list recent recordings
    const rows = await this.svc.list(100)
    return { success:true, rows }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/data')
  async data(@Param('id') id:string, @Res() res:any){
    const r = await this.svc.find(id)
    if(!r) return res.status(404).send('Not found')
    res.setHeader('Content-Type', 'audio/webm')
    return res.send(r.data)
  }
}
