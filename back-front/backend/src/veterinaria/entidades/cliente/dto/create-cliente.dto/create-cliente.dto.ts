import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMascotaDto } from 'src/veterinaria/entidades/mascota/dto/create-mascota.dto/create-mascota.dto';

export class CreateClienteDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del cliente' })
  nombre: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del cliente' })
  apellido: string;

  @ApiProperty({ example: 'juan.perez@mail.com', description: 'Email del cliente' })
  email: string;

  @ApiProperty({ example: '+34 600 123 456', description: 'Teléfono del cliente' })
  telefono: string;

  @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección del cliente' })
  direccion: string;

  @ApiPropertyOptional({
    type: [CreateMascotaDto],
    description: 'Lista de mascotas que se crearán junto al cliente',
  })
  mascotas?: CreateMascotaDto[];
}
