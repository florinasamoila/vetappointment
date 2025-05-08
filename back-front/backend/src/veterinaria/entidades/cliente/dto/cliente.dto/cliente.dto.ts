// src/veterinaria/dto/cliente.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MascotaDto } from 'src/veterinaria/entidades/mascota/dto/mascota.dto/mascota.dto';

export class ClienteDto {
  @ApiProperty({ example: '60ddae923b1e8b001f8a1a2c' })
  _id: string;

  @ApiProperty({ example: 'Juan' })
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  apellido: string;

  @ApiProperty({ example: 'juan.perez@mail.com' })
  email: string;

  @ApiProperty({ example: '+34 600 123 456' })
  telefono: string;

  @ApiProperty({ example: 'Calle Falsa 123' })
  direccion: string;

  @ApiProperty({ type: () => MascotaDto, isArray: true })
  mascotas: MascotaDto[];
}
