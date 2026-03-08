import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonsService {
  constructor(@InjectRepository(Lesson) private repo: Repository<Lesson>){}

  async list(){
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async find(id:string){
    return this.repo.findOne({ where: { id } })
  }

  async create(data: Partial<Lesson>){
    const l = this.repo.create(data as Lesson)
    return this.repo.save(l)
  }

  async update(id:string, data: Partial<Lesson>){
    await this.repo.update(id, data)
    return this.find(id)
  }

  async remove(id:string){
    return this.repo.delete(id)
  }
}
