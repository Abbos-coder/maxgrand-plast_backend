import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PartnersRepository } from './partners.repository';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);

  constructor(
    private readonly repository: PartnersRepository,
    private readonly filesService: FilesService
  ) {}

  async create(dto: CreatePartnerDto, logo: Express.Multer.File): Promise<Partner> {
    this.logger.log('Creating new partner');
    
    const logoPath = await this.filesService.saveFile(logo);
    
    const partnerData = {
      name: dto.name,
      logo: logoPath,
    };
    
    const partner = await this.repository.create(partnerData as any);
    
    return partner;
  }

  async findAll(): Promise<Partner[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<Partner> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: UpdatePartnerDto, logo?: Express.Multer.File): Promise<Partner> {
    const existing = await this.findOne(id);

    let logoPath = existing.logo;
    
    // If new logo provided, delete old one and save new
    if (logo) {
      if (existing.logo) {
        await this.filesService.deleteFile(existing.logo);
      }
      logoPath = await this.filesService.saveFile(logo);
    }

    const updateData: any = {
      ...dto,
      logo: logoPath,
    };

    const updated = await this.repository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    this.logger.log(`Partner ${id} updated`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);

    // Delete associated logo
    if (entity.logo) {
      await this.filesService.deleteFile(entity.logo);
    }

    const deleted = await this.repository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    this.logger.log(`Partner ${id} removed`);
  }
}