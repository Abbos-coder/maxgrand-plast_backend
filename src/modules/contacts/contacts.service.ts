import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(private readonly repository: ContactsRepository) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    this.logger.log('Creating new contact');
    return this.repository.create(dto);
  }

  async findAll(): Promise<Contact[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<Contact> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return entity;
  }

  async updateStatus(id: string, dto: UpdateContactStatusDto): Promise<Contact> {
    await this.findOne(id);

    const updated = await this.repository.updateStatus(id, dto.status);
    if (!updated) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    this.logger.log(`Contact ${id} status updated to ${dto.status}`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const deleted = await this.repository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    this.logger.log(`Contact ${id} removed`);
  }
}
