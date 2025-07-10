import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/adapters/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Configuração CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Permitir cookies
    allowedHeaders: 'Content-Type,Accept,Authorization',
    exposedHeaders: 'Authorization',
  });

  // Adapter for handling exceptions globally
  const http_adapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(http_adapter));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Video Processing API')
    .setDescription('API de processamento de vídeos para o Hackathon FIAP')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
