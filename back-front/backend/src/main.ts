// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VeterinariaModule } from './veterinaria/veterinaria.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS
  app.enableCors({
    origin: '*', // Ajusta a la URL de tu frontend en producción
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Opciones de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Veterinaria API Documentación')
    .setDescription('API para la gestión de servicios veterinarios, citas, pacientes, etc.')
    .setVersion('1.0')
    // .addBearerAuth() // Descomenta si usas auth con JWT
    .build();

  // Generamos el documento solo con el módulo de Veterinaria
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [VeterinariaModule],
  });

  // ────────── POST‐PROCESADO: quitamos el tag "Veterinaria" ──────────
  // 1) Eliminamos el tag de la lista general
  document.tags = (document.tags ?? []).filter((t) => t.name !== 'Veterinaria');

  // 2) Lo quitamos de cada operación
  Object.values(document.paths).forEach((pathItem) => {
    Object.values(pathItem as any).forEach((operation: any) => {
      if (operation.tags) {
        operation.tags = (operation.tags as string[]).filter((tag) => tag !== 'Veterinaria');
      }
    });
  });
  // ────────────────────────────────────────────────────────────────────

  // Montamos Swagger UI en /api-docs
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor ejecutándose en http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📖 Documentación Swagger en http://localhost:${process.env.PORT ?? 3000}/api-docs`);
}

bootstrap();
