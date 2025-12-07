import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly repository: Repository<Contact>
  ) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    const entity = this.repository.create({
      ...dto,
      status: ContactStatus.NEW,
    });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Contact[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: ContactStatus): Promise<Contact | null> {
    await this.repository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
