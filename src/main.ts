import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust this based on your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Warehouse Management API')
    .setDescription(
      'API for managing warehouse stock, transactions, and projects',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || process.env.SERVER_PORT || 3002;

  await app.listen(PORT);
  console.log('🌐 ENV PORT:', process.env.PORT);
  console.log('🌐 SERVER_PORT:', process.env.SERVER_PORT);
  console.log(`🚀 Server is running on http://localhost:${PORT}/api`);
}
bootstrap();
