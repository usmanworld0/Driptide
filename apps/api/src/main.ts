import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('DriptideBootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 4000;
  const allowedOrigins = configService.get<string[]>('cors.allowedOrigins') || [
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or allowed origins
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev permissive
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,x-session-id',
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`🌊 DRIPTIDE API ENGINE online at http://localhost:${port}/api/v1`);
  logger.log(`   - Public Catalog: http://localhost:${port}/api/v1/catalog/products`);
  logger.log(`   - Shopping Bag:   http://localhost:${port}/api/v1/cart`);
  logger.log(`   - Checkout/Order: http://localhost:${port}/api/v1/orders/checkout`);
  logger.log(`   - Admin Portal:   http://localhost:${port}/api/v1/admin/metrics`);
  logger.log(`=======================================================`);
}

bootstrap();
