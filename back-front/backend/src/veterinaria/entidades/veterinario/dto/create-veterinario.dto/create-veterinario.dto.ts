// src/veterinaria/dto/create-veterinario.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateVeterinarioDto {
  @ApiProperty({
    description: 'Nombre del veterinario',
    example: 'Juan'
  })
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    description: 'Apellido del veterinario',
    example: 'Pérez'
  })
  @IsString()
  @IsNotEmpty()
  readonly apellido: string;

  @ApiProperty({
    description: 'Especialidad del veterinario',
    example: 'Dermatología'
  })
  @IsString()
  @IsNotEmpty()
  readonly especialidad: string;

  @ApiProperty({
    description: 'Correo electrónico del veterinario',
    example: 'juan.perez@veterinaria.com'
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Teléfono de contacto del veterinario',
    example: '+34 600 123 456'
  })
  @IsString()
  @IsNotEmpty()
  readonly telefono: string;
}
