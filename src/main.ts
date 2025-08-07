import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('HH.UZ Platforma API')
    .setDescription('Bu API hujjatlari HH.UZ loyihasi uchun mo‘ljallangan')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Server is running on http://localhost:${PORT}/api`);
  console.log(`📚 Swagger docs on http://localhost:${PORT}/api/docs`);
}
bootstrap();
