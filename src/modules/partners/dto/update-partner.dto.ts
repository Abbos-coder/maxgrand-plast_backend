import { PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}