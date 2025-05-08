// src/veterinaria/dto/add-entrada-historial.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AddEntradaHistorialDto {
  @ApiProperty({ description: 'ID de la entrada (ObjectId)', example: '680bbca44812130eb094853c' })
  _id: string;

  @ApiProperty({
    description: 'ID de la cita asociada (ObjectId)',
    example: '60f7b2d5a1234b00123c4567',
  })
  cita: string;

  @ApiProperty({
    description: 'ID del veterinario que realiza la entrada',
    example: '60f7b2d5a1234b00123c4568',
  })
  veterinario: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Fecha y hora de la entrada en ISO',
    example: new Date().toISOString(),
  })
  fecha: Date;

  @ApiProperty({
    description: 'Diagnósticos realizados',
    example: 'Dermatitis alérgica',
  })
  diagnosticos: string;

  @ApiProperty({
    description: 'Tratamientos indicados',
    example: 'Baño medicado diario',
  })
  tratamientos: string;

  @ApiProperty({
    description: 'Observaciones adicionales',
    example: 'La mascota reaccionó bien al baño',
    required: false,
  })
  observaciones?: string;
}
