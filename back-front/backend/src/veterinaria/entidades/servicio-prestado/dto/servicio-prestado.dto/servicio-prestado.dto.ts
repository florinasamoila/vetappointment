// src/veterinaria/dto/servicio-prestado.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ServicioPrestadoDto {
  @ApiProperty({
    description: 'ID del servicio (ObjectId)',
    example: '60f7b2d5a1234b00123c4590',
  })
  @IsString()
  @IsNotEmpty()
  readonly _id: string;

  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Consulta General',
  })
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Consulta médica general para chequeo de salud',
  })
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @ApiProperty({
    description: 'Costo del servicio en la moneda local',
    example: 25.5,
  })
  @IsNumber()
  @Min(0)
  readonly costo: number;
}
