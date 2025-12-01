import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { PartnersRepository } from './partners.repository';
import { Partner } from './entities/partner.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partner]), FilesModule],
  controllers: [PartnersController],
  providers: [PartnersService, PartnersRepository],
  exports: [PartnersService],
})
export class PartnersModule {}