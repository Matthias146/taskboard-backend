import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import type { Request } from 'express';
import { User } from '../users/entity/user.entity';

@ApiTags('Contacts')
@ApiBearerAuth('JWT-auth')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as User;
    return this.contactsService.findAll(user.id);
  }

  @Post()
  create(@Body() dto: CreateContactDto, @Req() req: Request) {
    const user = req.user as User;
    return this.contactsService.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateContactDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.contactsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.contactsService.remove(id, user.id);
  }
}
