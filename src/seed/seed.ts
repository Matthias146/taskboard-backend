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
  const adminName = config.get<string>('SEED_ADMIN_NAME') ?? 'Admin User';

  const userEmail = config.get<string>('SEED_USER_EMAIL');
  const userPassword = config.get<string>('SEED_USER_PASSWORD');
  const userName = config.get<string>('SEED_USER_NAME') ?? 'Test User';

  if (adminEmail && adminPassword) {
    const existingAdmin = await usersService.findByEmail(adminEmail);
    if (!existingAdmin) {
      await usersService.create({
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: adminName, // 🆕 Name hinzufügen
        role: UserRole.ADMIN,
      });
      console.log(`✅ Admin "${adminName}" (${adminEmail}) erstellt`);
    } else {
      console.log(`ℹ️ Admin "${adminEmail}" existiert bereits`);
    }
  }

  if (userEmail && userPassword) {
    const existingUser = await usersService.findByEmail(userEmail);
    if (!existingUser) {
      await usersService.create({
        email: userEmail,
        password: await bcrypt.hash(userPassword, 10),
        name: userName, // 🆕 Name hinzufügen
        role: UserRole.USER,
      });
      console.log(`✅ User "${userName}" (${userEmail}) erstellt`);
    } else {
      console.log(`ℹ️ User "${userEmail}" existiert bereits`);
    }
  }

  await app.close();
}

void bootstrap();
