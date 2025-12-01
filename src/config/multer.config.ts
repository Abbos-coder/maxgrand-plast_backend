import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,webp').split(',');

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    const ext = extname(file.originalname).toLowerCase().substring(1);
    
    if (!ALLOWED_TYPES.includes(ext)) {
      return callback(
        new BadRequestException(
          `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
        ),
        false
      );
    }
    
    callback(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};