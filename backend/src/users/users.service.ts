import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(partial: Partial<User>) {
    const u = this.repo.create(partial as User);
    return this.repo.save(u);
  }

  async list(limit = 50) {
    return this.repo.find({ take: limit, order: { createdAt: 'DESC' } });
  }
}
