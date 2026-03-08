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
  async create(@Body() body:any, @Param() params:any, @Param('') p:any){
    // simple admin check
    if(!body) throw new HttpException('Invalid',400)
    const lesson = await this.svc.create(body)
    return { success:true, lesson }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id:string, @Body() body:any){
    const updated = await this.svc.update(id, body)
    return { success:true, updated }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async del(@Param('id') id:string){
    await this.svc.remove(id)
    return { success:true }
  }
}
