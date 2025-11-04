import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Task } from '../tasks/entiity/task.entity';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
