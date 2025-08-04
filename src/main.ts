import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

  })



  const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
  const port = process.env.PORT ?? '3000';

  const swaggerConfig = new DocumentBuilder()
    .setTitle('URL shortener API')
    .setDescription('Secure API for shortening URLs')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',        // ✅ name in Swagger UI
        in: 'header',                // ✅ location of token
      },
      'access-token',                // <-- unique name ID for Swagger
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('doc', app, document)

  await app.listen(+port, () => {
    console.log(`🚀 App started on ${baseUrl}`);
    console.log(`📄 App started on swagger ${baseUrl}/doc`);
  });
}
bootstrap();
