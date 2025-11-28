import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { Contact } from './entity/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [ContactsService],
  controllers: [ContactsController],
  exports: [ContactsService],
})
export class ContactsModule {}
