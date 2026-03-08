import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpException } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/lessons')
export class LessonsController {
  constructor(private svc: LessonsService) {}

  @Get()
  async list() {
    const rows = await this.svc.list();
    return { success: true, rows };
  }

  @Get(':id')
  async get(@Param('id') id: string){
    const r = await this.svc.find(id);
    return { success: true, row: r };
  }

  // admin
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req:any, @Body() body:any){
    if(!req.user || req.user.role !== 'admin') throw new HttpException('Forbidden',403)
    if(!body) throw new HttpException('Invalid',400)
    const lesson = await this.svc.create(body)
    return { success:true, lesson }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req:any, @Param('id') id:string, @Body() body:any){
    if(!req.user || req.user.role !== 'admin') throw new HttpException('Forbidden',403)
    const updated = await this.svc.update(id, body)
    return { success:true, updated }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async del(@Req() req:any, @Param('id') id:string){
    if(!req.user || req.user.role !== 'admin') throw new HttpException('Forbidden',403)
    await this.svc.remove(id)
    return { success:true }
  }
}
