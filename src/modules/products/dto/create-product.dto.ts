import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product title', example: 'Premium Laptop' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Product description', example: 'High-performance laptop with latest specs' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ 
    description: 'Product images', 
    example: ['/uploads/product-1.jpg', '/uploads/product-2.jpg'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}