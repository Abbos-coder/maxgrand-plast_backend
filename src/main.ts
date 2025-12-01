import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Static files for uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Swagger documentation
  if (process.env.SWAGGER_ENABLED === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Landing Backend API')
      .setDescription('API for Landing Page Content Management')
      .setVersion('1.0')
      .addTag('Hero Section', 'Hero section management')
      .addTag('About Section', 'About section management')
      .addTag('Products', 'Products management')
      .addTag('Partners', 'Partners management')
      .addTag('Files', 'File upload management')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = process.env.SWAGGER_PATH || 'api/docs';
    SwaggerModule.setup(swaggerPath, app, document, {
      customSiteTitle: 'Landing Backend API',
      customCss: '.swagger-ui .topbar { display: none }',
    });

    logger.log(`Swagger documentation available at: http://localhost:${process.env.PORT || 3000}/${swaggerPath}`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();