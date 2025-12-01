import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAboutSectionDto {
  @ApiProperty({ description: 'About section title', example: 'About Us' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'About section text', example: 'We are a company that...' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ description: 'Image URL or path', example: '/uploads/about-image.jpg' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  image?: string;
}