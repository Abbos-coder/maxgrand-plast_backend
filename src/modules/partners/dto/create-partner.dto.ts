import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Partner name', example: 'Tech Company Inc.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}