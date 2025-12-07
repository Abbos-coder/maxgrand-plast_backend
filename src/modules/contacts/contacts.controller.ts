import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { Contact } from './entities/contact.entity';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully', type: Contact })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body(ValidationPipe) dto: CreateContactDto
  ): Promise<Contact> {
    return this.contactsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, description: 'List of contacts', type: [Contact] })
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact found', type: Contact })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update contact status' })
  @ApiResponse({ status: 200, description: 'Contact status updated', type: Contact })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateContactStatusDto
  ): Promise<Contact> {
    return this.contactsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete contact' })
  @ApiResponse({ status: 204, description: 'Contact deleted' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.contactsService.remove(id);
  }
}
