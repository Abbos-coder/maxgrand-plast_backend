import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutSection } from './entities/about-section.entity';
import { CreateAboutSectionDto } from './dto/create-about-section.dto';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto';

@Injectable()
export class AboutSectionRepository {
  constructor(
    @InjectRepository(AboutSection)
    private readonly repository: Repository<AboutSection>
  ) {}

  async create(dto: CreateAboutSectionDto): Promise<AboutSection> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<AboutSection[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AboutSection | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateAboutSectionDto): Promise<AboutSection | null> {
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}