import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entity/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);
  const usersService = app.get(UsersService);

  const adminEmail = config.get<string>('SEED_ADMIN_EMAIL');
  const adminPassword = config.get<string>('SEED_ADMIN_PASSWORD');
  const userEmail = config.get<string>('SEED_USER_EMAIL');
  const userPassword = config.get<string>('SEED_USER_PASSWORD');

  if (adminEmail && adminPassword) {
    const existingAdmin = await usersService.findByEmail(adminEmail);
    if (!existingAdmin) {
      await usersService.create({
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: UserRole.ADMIN,
      });
      console.log(`✅ Admin ${adminEmail} erstellt`);
    }
  }

  if (userEmail && userPassword) {
    const existingUser = await usersService.findByEmail(userEmail);
    if (!existingUser) {
      await usersService.create({
        email: userEmail,
        password: await bcrypt.hash(userPassword, 10),
        role: UserRole.USER,
      });
      console.log(`✅ User ${userEmail} erstellt`);
    }
  }

  await app.close();
}

void bootstrap();
