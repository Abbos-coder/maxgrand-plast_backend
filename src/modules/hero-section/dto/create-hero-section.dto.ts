import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHeroSectionDto {
  @ApiProperty({ description: 'Hero section title', example: 'Welcome to Our Platform' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Hero section subtitle', example: 'Build amazing things with us' })
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @ApiPropertyOptional({ description: 'Background video URL or path', example: '/uploads/hero-video.mp4' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  backgroundVideo?: string;
}