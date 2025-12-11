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

  async create(dto: CreateProductDto, images: Express.Multer.File[]): Promise<Product> {
    this.logger.log('Creating new product');
    
    const imagePaths = await this.filesService.saveFiles(images);
    
    const productData = {
      title: dto.title,
      description: dto.description,
      images: imagePaths,
    };
    
    return this.repository.create(productData as any);
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

  async update(id: string, dto: UpdateProductDto, images?: Express.Multer.File[]): Promise<Product> {
    const existing = await this.findOne(id);

    let imagePaths = existing.images;
    
    // If new images provided, delete old ones and save new
    if (images && images.length > 0) {
      if (existing.images && existing.images.length > 0) {
        await this.filesService.deleteFiles(existing.images);
      }
      imagePaths = await this.filesService.saveFiles(images);
    }

    const updateData: any = {
      ...dto,
      images: imagePaths,
    };

    const updated = await this.repository.update(id, updateData);
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
