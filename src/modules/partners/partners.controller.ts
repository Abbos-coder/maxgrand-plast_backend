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
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';
import { multerConfig } from '../../config/multer.config';

@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create partner' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'logo'],
      properties: {
        name: { type: 'string', example: 'Tech Company Inc.' },
        logo: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Partner created successfully', type: Partner })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: false, forbidNonWhitelisted: false })) body: any,
    @UploadedFile() logo: Express.Multer.File
  ): Promise<Partner> {
    if (!logo) {
      throw new BadRequestException('Logo file is required');
    }
    if (!body.name || typeof body.name !== 'string') {
      throw new BadRequestException('Name is required and must be a string');
    }
    if (body.name.length > 255) {
      throw new BadRequestException('Name must be shorter than or equal to 255 characters');
    }
    
    const dto: CreatePartnerDto = { name: body.name };
    return this.partnersService.create(dto, logo);
  }

  @Get()
  @ApiOperation({ summary: 'Get all partners' })
  @ApiResponse({ status: 200, description: 'List of partners', type: [Partner] })
  async findAll(): Promise<Partner[]> {
    return this.partnersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get partner by ID' })
  @ApiResponse({ status: 200, description: 'Partner found', type: Partner })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async findOne(@Param('id') id: string): Promise<Partner> {
    return this.partnersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update partner' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Tech Company Inc.' },
        logo: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Partner updated', type: Partner })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: false, forbidNonWhitelisted: false })) body: any,
    @UploadedFile() logo?: Express.Multer.File
  ): Promise<Partner> {
    const dto: UpdatePartnerDto = {};
    
    if (body.name !== undefined) {
      if (typeof body.name !== 'string') {
        throw new BadRequestException('Name must be a string');
      }
      if (body.name.length > 255) {
        throw new BadRequestException('Name must be shorter than or equal to 255 characters');
      }
      dto.name = body.name;
    }
    
    return this.partnersService.update(id, dto, logo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete partner' })
  @ApiResponse({ status: 204, description: 'Partner deleted' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.partnersService.remove(id);
  }
}