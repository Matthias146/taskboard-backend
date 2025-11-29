import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { User } from '../users/entity/user.entity';
import { Contact } from './entitity/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async findAll(userId: number): Promise<Contact[]> {
    return this.contactRepo.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async create(dto: CreateContactDto, user: User): Promise<Contact> {
    const contact = this.contactRepo.create({ ...dto, user });
    return await this.contactRepo.save(contact);
  }

  async update(id: number, dto: UpdateContactDto, userId: number) {
    const contact = await this.contactRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!contact) throw new NotFoundException('Kontakt nicht gefunden');

    Object.assign(contact, dto);
    return await this.contactRepo.save(contact);
  }

  async remove(id: number, userId: number) {
    const result = await this.contactRepo.delete({ id, user: { id: userId } });
    if (result.affected === 0) {
      throw new NotFoundException('Kontakt nicht gefunden');
    }
  }
}
