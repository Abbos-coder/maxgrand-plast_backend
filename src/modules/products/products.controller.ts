import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { multerConfig } from '../../config/multer.config';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create product' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'images'],
      properties: {
        title: { type: 'string', example: 'Premium Laptop' },
        description: { type: 'string', example: 'High-performance laptop' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: false, forbidNonWhitelisted: false })) body: any,
    @UploadedFiles() images: Express.Multer.File[]
  ): Promise<Product> {
    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    if (images.length > 10) {
      throw new BadRequestException('Maximum 10 images allowed');
    }
    if (!body.title || typeof body.title !== 'string') {
      throw new BadRequestException('Title is required and must be a string');
    }
    if (body.title.length > 255) {
      throw new BadRequestException('Title must be shorter than or equal to 255 characters');
    }
    if (!body.description || typeof body.description !== 'string') {
      throw new BadRequestException('Description is required and must be a string');
    }
    
    const dto: CreateProductDto = {
      title: body.title,
      description: body.description,
    };
    return this.productsService.create(dto, images);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products', type: [Product] })
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update product' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Premium Laptop' },
        description: { type: 'string', example: 'High-performance laptop' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product updated', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: false, forbidNonWhitelisted: false })) body: any,
    @UploadedFiles() images?: Express.Multer.File[]
  ): Promise<Product> {
    if (images && images.length > 10) {
      throw new BadRequestException('Maximum 10 images allowed');
    }
    
    const dto: UpdateProductDto = {};
    
    if (body.title !== undefined) {
      if (typeof body.title !== 'string') {
        throw new BadRequestException('Title must be a string');
      }
      if (body.title.length > 255) {
        throw new BadRequestException('Title must be shorter than or equal to 255 characters');
      }
      dto.title = body.title;
    }
    
    if (body.description !== undefined) {
      if (typeof body.description !== 'string') {
        throw new BadRequestException('Description must be a string');
      }
      dto.description = body.description;
    }
    
    return this.productsService.update(id, dto, images);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}