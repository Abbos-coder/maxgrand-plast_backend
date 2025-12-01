import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutSectionController } from './about-section.controller';
import { AboutSectionService } from './about-section.service';
import { AboutSectionRepository } from './about-section.repository';
import { AboutSection } from './entities/about-section.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([AboutSection]), FilesModule],
  controllers: [AboutSectionController],
  providers: [AboutSectionService, AboutSectionRepository],
  exports: [AboutSectionService],
})
export class AboutSectionModule {}