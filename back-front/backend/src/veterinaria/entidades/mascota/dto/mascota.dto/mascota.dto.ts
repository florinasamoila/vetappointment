// src/veterinaria/dto/mascota.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  IsMongoId,
  IsInt,
} from 'class-validator';

export class MascotaDto {
  @ApiPropertyOptional({
    description: 'ID de la mascota (ObjectId)',
    example: '60f7b2d5a1234b00123c4567',
  })
  @IsOptional()
  @IsMongoId()
  readonly _id?: string;

  @ApiProperty({
    description: 'Nombre de la mascota',
    example: 'Max',
  })
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    description: 'Especie de la mascota',
    example: 'Perro',
  })
  @IsString()
  @IsNotEmpty()
  readonly especie: string;

  @ApiProperty({
    description: 'Raza de la mascota',
    example: 'Labrador Retriever',
  })
  @IsString()
  @IsNotEmpty()
  readonly raza: string;

  @ApiProperty({
    description: 'Edad de la mascota en años (entero)',
    example: 3,
  })
  @IsInt()
  @Min(0)
  readonly edad: number;

  @ApiProperty({
    description: 'Sexo de la mascota',
    example: 'Macho',
  })
  @IsString()
  @IsNotEmpty()
  readonly sexo: string;

  @ApiProperty({
    description: 'Color principal de la mascota',
    example: 'Marrón',
  })
  @IsString()
  @IsNotEmpty()
  readonly color: string;

  @ApiProperty({
    description: 'Peso de la mascota en kg',
    example: 12.5,
  })
  @IsNumber()
  @Min(0)
  readonly peso: number;

  @ApiPropertyOptional({
    description: 'Características adicionales (marcas, notas, etc.)',
    example: 'Mancha blanca en el pecho',
  })
  @IsString()
  @IsOptional()
  readonly caracteristicas?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'Fecha de nacimiento de la mascota en ISO',
    example: '2018-06-21',
  })
  @IsDateString()
  @IsOptional()
  readonly fechaNacimiento?: Date;

  @ApiProperty({
    description: 'ID del cliente propietario (ObjectId)',
    example: '60f7b2d5a1234b00123c4568',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly cliente: string;
}
