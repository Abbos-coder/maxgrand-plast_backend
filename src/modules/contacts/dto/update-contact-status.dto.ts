import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactStatusDto {
  @ApiProperty({ 
    description: 'Contact status', 
    enum: ContactStatus,
    example: ContactStatus.CLOSED 
  })
  @IsEnum(ContactStatus)
  @IsNotEmpty()
  status: ContactStatus;
}
