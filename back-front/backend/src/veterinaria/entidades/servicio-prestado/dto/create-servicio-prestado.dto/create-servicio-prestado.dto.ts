// src/veterinaria/dto/create-servicio-prestado.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateServicioPrestadoDto {
  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Consulta general',
  })
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Revisión completa del estado de salud de la mascota',
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
