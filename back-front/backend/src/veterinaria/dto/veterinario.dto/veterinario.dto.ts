// src/veterinaria/dto/veterinario.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsMongoId,
  IsPhoneNumber,
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { CitaDto } from '../cita.dto/cita.dto';

export class VeterinarioDto {
  @ApiProperty({
    description: 'ID del veterinario (ObjectId)',
    example: '60f7b2d5a1234b00123c4591'
  })
  @IsMongoId()
  readonly _id: string;

  @ApiProperty({
    description: 'Nombre del veterinario',
    example: 'María'
  })
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    description: 'Apellido del veterinario',
    example: 'González'
  })
  @IsString()
  @IsNotEmpty()
  readonly apellido: string;

  @ApiProperty({
    description: 'Especialidad del veterinario',
    example: 'Pediatría de mascotas'
  })
  @IsString()
  @IsNotEmpty()
  readonly especialidad: string;

  @ApiProperty({
    description: 'Correo electrónico del veterinario',
    example: 'maria.gonzalez@vetappointment.com'
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Teléfono de contacto del veterinario',
    example: '+34123456789'
  })
  @IsPhoneNumber(undefined)
  readonly telefono: string;

  @ApiProperty({
    description: 'Listado de citas asignadas al veterinario',
    type: [CitaDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CitaDto)
  readonly citas: CitaDto[];
}
