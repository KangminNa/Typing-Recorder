import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recording } from './recording.entity';
import { RecordingsService } from './recordings.service';
import { RecordingsController } from './recordings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recording])],
  providers: [RecordingsService],
  controllers: [RecordingsController],
  exports: [RecordingsService]
})
export class RecordingsModule {}
