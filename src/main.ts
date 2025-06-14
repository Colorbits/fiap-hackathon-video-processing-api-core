import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/adapters/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
