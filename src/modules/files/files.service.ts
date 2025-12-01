import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadPath = process.env.UPLOAD_PATH || './uploads';

  async saveFile(file: Express.Multer.File): Promise<string> {
    try {
      const relativePath = `/uploads/${file.filename}`;
      this.logger.log(`File saved: ${relativePath}`);
      return relativePath;
    } catch (error) {
      this.logger.error(`Failed to save file: ${error.message}`);
      throw error;
    }
  }

  async saveFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.saveFile(file)));
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (!filePath) return;

      const fullPath = join(process.cwd(), filePath);
      
      try {
        await fs.access(fullPath);
        await fs.unlink(fullPath);
        this.logger.log(`File deleted: ${filePath}`);
      } catch (error) {
        this.logger.warn(`File not found or already deleted: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  async deleteFiles(filePaths: string[]): Promise<void> {
    await Promise.all(filePaths.map((path) => this.deleteFile(path)));
  }

  getFileUrl(filePath: string): string {
    if (!filePath) return '';
    return filePath.startsWith('http') ? filePath : `${process.env.APP_URL || 'http://localhost:3000'}${filePath}`;
  }
}