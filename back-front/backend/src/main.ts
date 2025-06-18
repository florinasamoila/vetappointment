// Descripción: Este archivo es el punto de entrada de la aplicación NestJS. Aquí se configura el servidor, se habilita CORS y se establece la documentación Swagger.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger-config/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'https://vetappointment-backend.onrender.com',
    // 'http://localhost:4200' // opcional para dev
  ];
  // Habilitamos CORS
  app.enableCors({
    origin: [
      'https://vetappointment-2.onrender.com',
      'http://localhost:4200',
    ],
    credentials: true,
  });

  // Configuramos Swagger (código extraído a swagger.config.ts)
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor ejecutándose en http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📖 Documentación Swagger en http://localhost:${process.env.PORT ?? 3000}/api-docs`);
}

bootstrap();
