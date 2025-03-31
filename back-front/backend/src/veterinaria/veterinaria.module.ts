import { Module } from '@nestjs/common';
import { VeterinariaService } from './veterinaria.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CitaSchema } from './schemas/cita.schema/cita.schema';
import { ClienteSchema } from './schemas/cliente.schema/cliente.schema';
import { FacturacionSchema } from './schemas/facturacion.schema/facturacion.schema';
import { HistorialMedicoSchema } from './schemas/historial-medico.schema/historial-medico.schema';

import { ServicioPrestadoSchema } from './schemas/servicio-prestado.schema/servicio-prestado.schema';
import { VeterinarioSchema } from './schemas/veterinario.schema/veterinario.schema';
import { VeterinariaController } from './veterinaria.controller';
import { MascotaSchema } from './schemas/mascota.schema/mascota.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: 'Cita',
          schema: CitaSchema,
          collection: 'cita'
        },
        {
          name: 'Cliente',
          schema: ClienteSchema,
          collection: 'cliente'
        },
        {
          name: 'Facturacion',
          schema: FacturacionSchema,
          collection: 'facturacion'
        },
        {
          name: 'HistorialMedico',
          schema: HistorialMedicoSchema,
          collection: 'historialMedico'
        },
        {
          name: 'Mascota',
          schema: MascotaSchema,
          collection: 'mascota'
        },
        {
          name: 'ServicioPrestado',
          schema: ServicioPrestadoSchema,
          collection: 'servicioPrestado'
        },
        {
          name: 'Veterinario',
          schema: VeterinarioSchema,
          collection: 'veterinario'
        }
      ]
    )
  ],
  providers: [VeterinariaService],
  controllers: [VeterinariaController]
})
export class VeterinariaModule {}
