import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { AboutSectionRepository } from './about-section.repository';
import { CreateAboutSectionDto } from './dto/create-about-section.dto';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto';
import { AboutSection } from './entities/about-section.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class AboutSectionService {
  private readonly logger = new Logger(AboutSectionService.name);

  constructor(
    private readonly repository: AboutSectionRepository,
    private readonly filesService: FilesService
  ) {}

  async create(dto: CreateAboutSectionDto): Promise<AboutSection> {
    this.logger.log('Creating new about section');
    return this.repository.create(dto);
  }

  async findAll(): Promise<AboutSection[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<AboutSection> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`About section with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateAboutSectionDto): Promise<AboutSection> {
    const existing = await this.findOne(id);

    // Delete old image if new one provided
    if (dto.image && existing.image && dto.image !== existing.image) {
      await this.filesService.deleteFile(existing.image);
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`About section with ID ${id} not found`);
    }

    this.logger.log(`About section ${id} updated`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);

    // Delete associated image
    if (entity.image) {
      await this.filesService.deleteFile(entity.image);
    }

    const deleted = await this.repository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`About section with ID ${id} not found`);
    }

    this.logger.log(`About section ${id} removed`);
  }
}