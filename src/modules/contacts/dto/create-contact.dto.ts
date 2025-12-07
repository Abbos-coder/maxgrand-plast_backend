import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'Contact name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Phone number', example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Phone must contain only numbers and valid characters' })
  phone: string;

  @ApiProperty({ description: 'Contact message', example: 'I would like to know more about your products' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
