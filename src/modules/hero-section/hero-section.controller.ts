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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HeroSectionService } from './hero-section.service';
import { CreateHeroSectionDto } from './dto/create-hero-section.dto';
import { UpdateHeroSectionDto } from './dto/update-hero-section.dto';
import { HeroSection } from './entities/hero-section.entity';

@ApiTags('Hero Section')
@Controller('hero-sections')
export class HeroSectionController {
  constructor(private readonly heroSectionService: HeroSectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create hero section' })
  @ApiResponse({ status: 201, description: 'Hero section created successfully', type: HeroSection })
  async create(
    @Body(ValidationPipe) dto: CreateHeroSectionDto
  ): Promise<HeroSection> {
    return this.heroSectionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hero sections' })
  @ApiResponse({ status: 200, description: 'List of hero sections', type: [HeroSection] })
  async findAll(): Promise<HeroSection[]> {
    return this.heroSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hero section by ID' })
  @ApiResponse({ status: 200, description: 'Hero section found', type: HeroSection })
  @ApiResponse({ status: 404, description: 'Hero section not found' })
  async findOne(@Param('id') id: string): Promise<HeroSection> {
    return this.heroSectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hero section' })
  @ApiResponse({ status: 200, description: 'Hero section updated', type: HeroSection })
  @ApiResponse({ status: 404, description: 'Hero section not found' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateHeroSectionDto
  ): Promise<HeroSection> {
    return this.heroSectionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete hero section' })
  @ApiResponse({ status: 204, description: 'Hero section deleted' })
  @ApiResponse({ status: 404, description: 'Hero section not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.heroSectionService.remove(id);
  }
}