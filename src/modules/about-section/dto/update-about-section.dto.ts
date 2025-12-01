import { PartialType } from '@nestjs/swagger';
import { CreateAboutSectionDto } from './create-about-section.dto';

export class UpdateAboutSectionDto extends PartialType(CreateAboutSectionDto) {}