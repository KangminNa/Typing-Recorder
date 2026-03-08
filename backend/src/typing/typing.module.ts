import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypingService } from './typing.service';
import { TypingController } from './typing.controller';
import { TypingResult } from './typing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypingResult])],
  providers: [TypingService],
  controllers: [TypingController]
})
export class TypingModule {}
