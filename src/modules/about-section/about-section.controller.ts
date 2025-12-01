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
import { AboutSectionService } from './about-section.service';
import { CreateAboutSectionDto } from './dto/create-about-section.dto';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto';
import { AboutSection } from './entities/about-section.entity';

@ApiTags('About Section')
@Controller('about-sections')
export class AboutSectionController {
  constructor(private readonly aboutSectionService: AboutSectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create about section' })
  @ApiResponse({ status: 201, description: 'About section created successfully', type: AboutSection })
  async create(
    @Body(ValidationPipe) dto: CreateAboutSectionDto
  ): Promise<AboutSection> {
    return this.aboutSectionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all about sections' })
  @ApiResponse({ status: 200, description: 'List of about sections', type: [AboutSection] })
  async findAll(): Promise<AboutSection[]> {
    return this.aboutSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get about section by ID' })
  @ApiResponse({ status: 200, description: 'About section found', type: AboutSection })
  @ApiResponse({ status: 404, description: 'About section not found' })
  async findOne(@Param('id') id: string): Promise<AboutSection> {
    return this.aboutSectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update about section' })
  @ApiResponse({ status: 200, description: 'About section updated', type: AboutSection })
  @ApiResponse({ status: 404, description: 'About section not found' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateAboutSectionDto
  ): Promise<AboutSection> {
    return this.aboutSectionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete about section' })
  @ApiResponse({ status: 204, description: 'About section deleted' })
  @ApiResponse({ status: 404, description: 'About section not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.aboutSectionService.remove(id);
  }
}