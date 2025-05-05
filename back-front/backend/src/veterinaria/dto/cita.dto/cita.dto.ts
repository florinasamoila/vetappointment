import { ApiProperty } from '@nestjs/swagger';
import { ClienteDto } from '../cliente.dto/cliente.dto';
import { MascotaDto } from '../mascota.dto/mascota.dto';
import { ServicioPrestadoDto } from '../servicio-prestado.dto/servicio-prestado.dto';
import { VeterinarioDto } from '../veterinario.dto/veterinario.dto';

export class CitaDto {
  @ApiProperty({
    description: 'Identificador único de la cita',
    example: '60ddae923b1e8b001f8a1a2c'
  })
  _id: string;

  @ApiProperty({
    description: 'Fecha y hora programada de la cita',
    type: String,
    format: 'date-time',
    example: '2025-05-12T14:30:00Z'
  })
  fechaHora: Date;

  @ApiProperty({
    description: 'Motivo de la cita',
    example: 'Chequeo general'
  })
  motivo: string;

  @ApiProperty({
    description: 'Estado de la cita',
    enum: ['Programada', 'Confirmada', 'Cancelada', 'Completada'],
    example: 'Programada'
  })
  estado: 'Programada' | 'Confirmada' | 'Cancelada' | 'Completada';

  @ApiProperty({
    description: 'Datos del cliente asociado',
    type: () => ClienteDto
  })
  cliente: ClienteDto;

  @ApiProperty({
    description: 'Datos de la mascota asociada',
    type: () => MascotaDto
  })
  mascota: MascotaDto;

  @ApiProperty({
    description: 'Datos del veterinario asignado',
    type: () => VeterinarioDto
  })
  veterinario: VeterinarioDto;

  @ApiProperty({
    description: 'Datos del servicio prestado en la cita',
    type: () => ServicioPrestadoDto
  })
  servicioPrestado: ServicioPrestadoDto;
}
