import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypingModule } from './typing/typing.module';
import { TypingResult } from './typing/typing.entity';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { LessonsService } from './lessons/lessons.service';
import { Lesson } from './lessons/lesson.entity';
import { LessonsController } from './lessons/lessons.controller';
import { RecordingsService } from './recordings/recordings.service';
import { Recording } from './recordings/recording.entity';
import { RecordingsController } from './recordings/recordings.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { RecordingsModule } from './recordings/recordings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'db',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'typing',
      entities: [TypingResult, User, Lesson, Recording],
      synchronize: true
    }),
    TypingModule,
    AuthModule,
    UsersModule,
    LessonsModule,
    RecordingsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
