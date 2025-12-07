import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}