import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';

export async function ensureAdmin(users: UsersService){
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASS || 'adminpass';
  const existing = await users.findByEmail(adminEmail);
  if(existing) return;
  const hash = await bcrypt.hash(adminPass, 10);
  await users.create({ email: adminEmail, passwordHash: hash, role: 'admin', name: 'Administrator' });
  console.log('Created initial admin:', adminEmail);
}
