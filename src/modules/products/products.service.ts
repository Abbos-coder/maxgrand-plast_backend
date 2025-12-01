import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly repository: ProductsRepository,
    private readonly filesService: FilesService
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    this.logger.log('Creating new product');
    return this.repository.create(dto);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.findOne(id);

    // Delete old images if new ones provided
    if (dto.images && Array.isArray(dto.images) && dto.images.length > 0) {
      const imagesToDelete = existing.images.filter(img => !dto.images!.includes(img));
      if (imagesToDelete.length > 0) {
        await this.filesService.deleteFiles(imagesToDelete);
      }
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.logger.log(`Product ${id} updated`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);

    // Delete associated images
    if (entity.images && entity.images.length > 0) {
      await this.filesService.deleteFiles(entity.images);
    }

    const deleted = await this.repository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.logger.log(`Product ${id} removed`);
  }
}