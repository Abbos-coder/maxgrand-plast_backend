import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroSectionController } from './hero-section.controller';
import { HeroSectionService } from './hero-section.service';
import { HeroSectionRepository } from './hero-section.repository';
import { HeroSection } from './entities/hero-section.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([HeroSection]), FilesModule],
  controllers: [HeroSectionController],
  providers: [HeroSectionService, HeroSectionRepository],
  exports: [HeroSectionService],
})
export class HeroSectionModule {}
