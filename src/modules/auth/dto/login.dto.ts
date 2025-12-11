import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'changeMe123' })
  @IsString()
  @MinLength(4)
  password: string;
}
