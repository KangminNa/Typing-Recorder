import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypingResult } from './typing.entity';

@Injectable()
export class TypingService {
  constructor(
    @InjectRepository(TypingResult)
    private repo: Repository<TypingResult>
  ) {}

  async save(result: Partial<TypingResult>) {
    const r = this.repo.create(result as TypingResult);
    return this.repo.save(r);
  }

  async list(limit = 20) {
    return this.repo.find({ order: { wpm: 'DESC' }, take: limit });
  }
}
