import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersRepository {
  constructor(
    @InjectRepository(Partner)
    private readonly repository: Repository<Partner>
  ) {}

  async create(dto: CreatePartnerDto): Promise<Partner> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Partner[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Partner | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdatePartnerDto): Promise<Partner | null> {
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}