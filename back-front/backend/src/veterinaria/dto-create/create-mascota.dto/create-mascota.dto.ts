// src/veterinaria/dto/create-mascota.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  IsMongoId,
} from 'class-validator';

export class CreateMascotaDto {
  @ApiProperty({
    description: 'Nombre de la mascota',
    example: 'Firulais',
  })
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    description: 'Especie de la mascota (p.ej., Perro, Gato)',
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
    description: 'Edad de la mascota en años',
    example: 3,
  })
  @IsNumber()
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
    description: 'Color predominante de la mascota',
    example: 'Marrón',
  })
  @IsString()
  @IsNotEmpty()
  readonly color: string;

  @ApiProperty({
    description: 'Peso de la mascota en kilogramos',
    example: 12.5,
  })
  @IsNumber()
  @Min(0)
  readonly peso: number;

  @ApiProperty({
    description: 'Características o notas adicionales',
    example: 'Manchas negras en el lomo',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly caracteristicas?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato ISO',
    example: '2022-05-15T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  readonly fechaNacimiento?: Date;

  @ApiProperty({
    description: 'ID del cliente propietario (ObjectId)',
    example: '60f7b2d5a1234b00123c4569',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly cliente: string;
}
