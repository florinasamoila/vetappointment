import { ApiProperty } from '@nestjs/swagger';

export class CreateFacturacionDto {
  @ApiProperty({
    example: '60c72b2f4f1a25629c8e4b12',
    description: 'ID de la cita asociada a esta facturación',
  })
  cita: string;

  @ApiProperty({
    example: 150.75,
    description: 'Monto total de la facturación',
  })
  monto: number;

  @ApiProperty({
    example: '2025-04-29T15:30:00Z',
    description: 'Fecha en la que se realizó el pago (ISO 8601)',
    type: String,
    format: 'date-time',
  })
  fechaPago: Date;

  @ApiProperty({
    example: 'Tarjeta de crédito',
    description: 'Método de pago utilizado para la facturación',
  })
  metodoPago: string;
}
