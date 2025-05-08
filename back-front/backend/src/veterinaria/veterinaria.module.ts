import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AppGateway } from 'src/app.gateway';
import { CitaController } from './entidades/cita/controller/cita.controller';
import { CitaSchema } from './entidades/cita/schemas/cita.schema/cita.schema';
import { CitaService } from './entidades/cita/service/cita.service';
import { ClienteController } from './entidades/cliente/controller/cliente.controller';
import { ClienteSchema } from './entidades/cliente/schemas/cliente.schema/cliente.schema';
import { ClienteService } from './entidades/cliente/service/cliente.service';
import { HistorialMedicoController } from './entidades/historial-medico/controller/historialMedico.controller';
import { HistorialMedicoSchema } from './entidades/historial-medico/schemas/historial-medico.schema/historial-medico.schema';
import { HistorialMedicoService } from './entidades/historial-medico/service/historialMedico.service';
import { MascotaController } from './entidades/mascota/controller/mascota.controller';
import { MascotaSchema } from './entidades/mascota/schemas/mascota.schema/mascota.schema';
import { MascotaService } from './entidades/mascota/service/mascota.service';
import { ServicioPrestadoController } from './entidades/servicio-prestado/controller/servicio-prestado.controller';
import { ServicioPrestadoSchema } from './entidades/servicio-prestado/schemas/servicio-prestado.schema/servicio-prestado.schema';
import { ServicioPrestadoService } from './entidades/servicio-prestado/service/servicio-prestado.service';
import { VeterinarioController } from './entidades/veterinario/controller/veterinario.controller';
import { VeterinarioSchema } from './entidades/veterinario/schemas/veterinario.schema/veterinario.schema';
import { VeterinarioService } from './entidades/veterinario/service/veterinario.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Cita',
        schema: CitaSchema,
        collection: 'cita',
      },
      {
        name: 'Cliente',
        schema: ClienteSchema,
        collection: 'cliente',
      },

      {
        name: 'HistorialMedico',
        schema: HistorialMedicoSchema,
        collection: 'historialMedico',
      },
      {
        name: 'Mascota',
        schema: MascotaSchema,
        collection: 'mascota',
      },
      {
        name: 'ServicioPrestado',
        schema: ServicioPrestadoSchema,
        collection: 'servicioPrestado',
      },
      {
        name: 'Veterinario',
        schema: VeterinarioSchema,
        collection: 'veterinario',
      },
    ]),
  ],
  providers: [
    AppGateway,
    CitaService,
    ClienteService,
    HistorialMedicoService,
    MascotaService,
    ServicioPrestadoService,
    VeterinarioService,
  ],
  controllers: [
    CitaController,
    ClienteController,
    HistorialMedicoController,
    MascotaController,
    ServicioPrestadoController,
    VeterinarioController,
  ],
})
export class VeterinariaModule {}
