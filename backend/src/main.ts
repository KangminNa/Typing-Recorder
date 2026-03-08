import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { UsersService } from './users/users.service';
import { ensureAdmin } from './app.bootstrap-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.use(bodyParser.json({ limit: '8mb' }));
  await app.listen(3000);
  console.log('Backend listening on http://0.0.0.0:3000');

  // create initial admin if not exists
  try{
    const users = app.get(UsersService);
    await ensureAdmin(users);
  }catch(e){ console.warn('Could not ensure admin:', e.message || e) }
}
bootstrap();
