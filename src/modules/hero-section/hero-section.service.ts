import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { HeroSectionRepository } from './hero-section.repository';
import { CreateHeroSectionDto } from './dto/create-hero-section.dto';
import { UpdateHeroSectionDto } from './dto/update-hero-section.dto';
import { HeroSection } from './entities/hero-section.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class HeroSectionService {
  private readonly logger = new Logger(HeroSectionService.name);

  constructor(
    private readonly repository: HeroSectionRepository,
    private readonly filesService: FilesService
  ) {}

  async create(dto: CreateHeroSectionDto): Promise<HeroSection> {
    this.logger.log('Creating new hero section');
    return this.repository.create(dto);
  }

  async findAll(): Promise<HeroSection[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<HeroSection> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Hero section with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateHeroSectionDto): Promise<HeroSection> {
    const existing = await this.findOne(id);

    // Delete old video if new one provided
    if (dto.backgroundVideo && existing.backgroundVideo && dto.backgroundVideo !== existing.backgroundVideo) {
      await this.filesService.deleteFile(existing.backgroundVideo);
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Hero section with ID ${id} not found`);
    }

    this.logger.log(`Hero section ${id} updated`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);

    // Delete associated video
    if (entity.backgroundVideo) {
      await this.filesService.deleteFile(entity.backgroundVideo);
    }

    const deleted = await this.repository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Hero section with ID ${id} not found`);
    }

    this.logger.log(`Hero section ${id} removed`);
  }
}