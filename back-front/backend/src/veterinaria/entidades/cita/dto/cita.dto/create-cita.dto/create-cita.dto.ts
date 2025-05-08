export enum EstadoCita {
  Programada = 'Programada',
  Confirmada = 'Confirmada',
  Cancelada = 'Cancelada',
  Completada = 'Completada',
}

// src/veterinaria/dto/create-cita.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';


export class CreateCitaDto {
  @ApiProperty({
    description: 'Fecha y hora de la cita en formato ISO 8601',
    type: String,
    format: 'date-time'
  })
  @IsDateString()
  fechaHora: string;

  @ApiProperty({ description: 'Motivo de la cita' })
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @ApiProperty({
    description: 'Estado de la cita',
    enum: EstadoCita,
    example: EstadoCita.Programada
  })
  @IsEnum(EstadoCita)
  estado: EstadoCita;

  @ApiProperty({ description: 'ID de Mongo del cliente' })
  @IsMongoId()
  cliente: string;

  @ApiProperty({ description: 'ID de Mongo de la mascota' })
  @IsMongoId()
  mascota: string;

  @ApiProperty({ description: 'ID de Mongo del veterinario' })
  @IsMongoId()
  veterinario: string;

  @ApiProperty({ description: 'ID de Mongo del servicio prestado' })
  @IsMongoId()
  servicioPrestado: string;

  @ApiPropertyOptional({ description: 'Observaciones adicionales' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
