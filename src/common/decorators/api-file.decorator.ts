import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { multerConfig } from '@config/multer.config';

export function ApiFile(fieldName = 'file') {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, multerConfig)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
  );
}

export function ApiFiles(fieldName = 'files', maxCount = 10) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, multerConfig)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })
  );
}