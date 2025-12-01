import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroSection } from './entities/hero-section.entity';
import { CreateHeroSectionDto } from './dto/create-hero-section.dto';
import { UpdateHeroSectionDto } from './dto/update-hero-section.dto';

@Injectable()
export class HeroSectionRepository {
  constructor(
    @InjectRepository(HeroSection)
    private readonly repository: Repository<HeroSection>
  ) {}

  async create(dto: CreateHeroSectionDto): Promise<HeroSection> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<HeroSection[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<HeroSection | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateHeroSectionDto): Promise<HeroSection | null> {
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
  const result = await this.repository.delete(id);
  return (result.affected ?? 0) > 0;
}
}