import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VeterinariaModule } from 'src/veterinaria/veterinaria.module';


/**
 * Configuración de Swagger para la API de Veterinaria.
 * @param app - Instancia de la aplicación NestJS.
 */
export function setupSwagger(app: INestApplication): void {
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
}
