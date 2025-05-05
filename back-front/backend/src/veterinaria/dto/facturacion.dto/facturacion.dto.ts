// src/veterinaria/dto/facturacion.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { CitaDto } from '../cita.dto/cita.dto';

export class FacturacionDto {
  @ApiProperty({ example: '60f7b2d5a1234b00123c4567' })
  _id: string;

  @ApiProperty({ type: () => CitaDto })
  cita: CitaDto;

  @ApiProperty({ example: 150.75, description: 'Importe cobrado en la factura' })
  cantidad: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: new Date().toISOString(),
    description: 'Fecha en la que se realizó el pago'
  })
  fechaPago: Date;

  @ApiProperty({
    example: 'Tarjeta de crédito',
    description: 'Método utilizado para el pago'
  })
  metodoPago: string;
}
