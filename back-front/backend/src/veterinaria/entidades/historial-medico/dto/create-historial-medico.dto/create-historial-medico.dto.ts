// src/veterinaria/dto/create-historial-medico.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AddEntradaHistorialDto } from '../historial-medico.dto/add-entrada-historial.dto';

export class CreateHistorialMedicoDto {
  @ApiProperty({
    description: 'ID de la mascota para la que se crea el historial',
    example: '60c72b2f4f1a25629c8e4b12',
  })
  mascotaID: string;

  @ApiProperty({
    type: AddEntradaHistorialDto,
    description: 'Datos de la primera entrada en el historial',
  })
  entrada: AddEntradaHistorialDto;
}
