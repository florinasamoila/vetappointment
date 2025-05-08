// src/veterinaria/dto/historial-medico.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { CitaDto } from 'src/veterinaria/entidades/cita/dto/cita.dto/cita.dto';


export class HistorialMedicoDto {
  @ApiProperty({ example: '60f7b2d5a1234b00123c4567' })
  _id: string;

  @ApiProperty({ type: () => CitaDto, description: 'Datos de la cita asociada' })
  cita: CitaDto;

  @ApiProperty({
    description: 'ID de la mascota a la que pertenece este historial',
    example: '60f7b2d5a1234b00123c4568'
  })
  mascotaID: string;

  @ApiProperty({
    description: 'ID del veterinario que atendió',
    example: '60f7b2d5a1234b00123c4569'
  })
  veterinario: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: new Date().toISOString(),
    description: 'Fecha y hora de la entrada del historial'
  })
  fecha: Date;

  @ApiProperty({ example: 'Dermatitis alérgica', description: 'Diagnósticos registrados' })
  diagnosticos: string;

  @ApiProperty({ example: 'Baño medicado diario', description: 'Plan de tratamientos indicados' })
  tratamientos: string;

  @ApiProperty({ example: 'La mascota reaccionó bien al baño', description: 'Observaciones adicionales' })
  observaciones: string;
}
