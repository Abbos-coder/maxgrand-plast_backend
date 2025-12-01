import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { ApiFile, ApiFiles } from '@common/decorators/api-file.decorator';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload single file' })
  @ApiResponse({ 
    status: 201, 
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        path: { type: 'string', example: '/uploads/file-1234567890.jpg' },
        url: { type: 'string', example: 'http://localhost:3000/uploads/file-1234567890.jpg' }
      }
    }
  })
  @ApiFile('file')
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ path: string; url: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const path = await this.filesService.saveFile(file);
    const url = this.filesService.getFileUrl(path);

    return { path, url };
  }

  @Post('upload-multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiResponse({ 
    status: 201, 
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        paths: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['/uploads/file-1.jpg', '/uploads/file-2.jpg']
        },
        urls: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['http://localhost:3000/uploads/file-1.jpg', 'http://localhost:3000/uploads/file-2.jpg']
        }
      }
    }
  })
  @ApiFiles('files', 10)
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<{ paths: string[]; urls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    const paths = await this.filesService.saveFiles(files);
    const urls = paths.map((path) => this.filesService.getFileUrl(path));

    return { paths, urls };
  }
}