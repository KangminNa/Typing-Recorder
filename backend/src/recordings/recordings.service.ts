import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recording } from './recording.entity';

@Injectable()
export class RecordingsService {
  constructor(@InjectRepository(Recording) private repo: Repository<Recording>){}

  async save(data: Partial<Recording>){
    const r = this.repo.create(data as Recording)
    return this.repo.save(r)
  }

  async list(limit = 50){
    return this.repo.find({ take: limit, order: { createdAt: 'DESC' } })
  }

  async find(id:string){
    return this.repo.findOne({ where: { id } })
  }
}
