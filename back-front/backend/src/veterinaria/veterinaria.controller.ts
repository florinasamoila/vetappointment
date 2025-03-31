import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { VeterinariaService } from './veterinaria.service';
import { CreateClienteDto } from './dto-create/create-cliente.dto/create-cliente.dto';
import { UpdateClienteDto } from './dto-update/update-cliente.dto/update-cliente.dto';
import { CreateMascotaDto } from './dto-create/create-mascota.dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto-update/update-mascota.dto/update-mascota.dto';
import { CreateCitaDto } from './dto-create/create-cita.dto/create-cita.dto';
import { UpdateCitaDto } from './dto-update/update-cita.dto/update-cita.dto';
import { CreateFacturacionDto } from './dto-create/create-facturacion.dto/create-facturacion.dto';
import { UpdateFacturacionDto } from './dto-update/update-facturacion.dto/update-facturacion.dto';
import { CreateHistorialMedicoDto } from './dto-create/create-historial-medico.dto/create-historial-medico.dto';
import { UpdateHistorialMedicoDto } from './dto-update/update-historial-medico.dto/update-historial-medico.dto';
import { CreateServicioPrestadoDto } from './dto-create/create-servicio-prestado.dto/create-servicio-prestado.dto';
import { UpdateServicioPrestadoDto } from './dto-update/update-servicio-prestado.dto/update-servicio-prestado.dto';
import { CreateVeterinarioDto } from './dto-create/create-veterinario.dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from './dto-update/update-veterinario.dto/update-veterinario.dto';
import { ClienteDto } from './dto/cliente.dto/cliente.dto';
import { Mascota } from './interfaces/mascota/mascota.interface';

// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class VeterinariaController {
    constructor(private readonly veterinariaService: VeterinariaService) {}

//  Rutas para Clientes
@Post('clientes')
  async createCliente(@Body() createClienteDto: CreateClienteDto): Promise<ClienteDto> {
    return this.veterinariaService.createCliente(createClienteDto);
  }

  @Get('/clientes')
  async findAllClientes() {
    return this.veterinariaService.findAllClientes();
  }

    @Get('clientes/:id')
  async getClienteById(@Param('id') id: string): Promise<ClienteDto> {
    return this.veterinariaService.findClienteById(id);
  }


  @Put('/clientes/:id')
  async updateCliente(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.veterinariaService.updateCliente(id, updateClienteDto);
  }

  @Delete('/clientes/:id')
  async deleteCliente(@Param('id') id: string) {
    return this.veterinariaService.deleteCliente(id);
  }

//  Rutas para Mascotas
@Post('mascotas')
async createMascota(@Body() createMascotaDto: CreateMascotaDto): Promise<Mascota> {
  return this.veterinariaService.createMascota(createMascotaDto);
}

  @Get('/mascotas')
  async findAllMascotas() {
    return this.veterinariaService.findAllMascotas();
  }

  @Get('/mascotas/:id')
  async findMascotaById(@Param('id') id: string) {
    return this.veterinariaService.findMascotaById(id);
  }

  @Put('/mascotas/:id')
  async updateMascota(@Param('id') id: string, @Body() updateMascotaDto: UpdateMascotaDto) {
    return this.veterinariaService.updateMascota(id, updateMascotaDto);
  }

  @Delete('/mascotas/:id')
  async deleteMascota(@Param('id') id: string) {
    return this.veterinariaService.deleteMascota(id);
  }

//  Rutas para Cita
  @Post('/citas')
  async createCita(@Body() createCitaDto: CreateCitaDto) {
    return this.veterinariaService.createCita(createCitaDto);
  }

  @Get('/citas')
  async findAllCitas() {
    return this.veterinariaService.findAllCitas();
  }

  @Get('/citas/:id')
  async findCitaById(@Param('id') id: string) {
    return this.veterinariaService.findCitaById(id);
  }

  @Put('/citas/:id')
  async updateCita(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.veterinariaService.updateCita(id, updateCitaDto);
  }

  @Delete('/citas/:id')
  async deleteCita(@Param('id') id: string) {
    return this.veterinariaService.deleteCita(id);
  }

//  Rutas para facturacion
   @Post('/facturacion')
   async createFacturacion(@Body() createFacturacionDto: CreateFacturacionDto) {
     return this.veterinariaService.createFacturacion(createFacturacionDto);
   }
 
   @Get('/facturacion')
   async findAllFacturacion() {
     return this.veterinariaService.findAllFacturacion();
   }

   @Get('/facturacion/:id')
   async findFacturacionById(@Param('id') id: string) {
     return this.veterinariaService.findFacturacionById(id);
   }
 
   @Put('/facturacion/:id')
   async updateFacturacion(@Param('id') id: string, @Body() updateFacturacionDto: UpdateFacturacionDto) {
     return this.veterinariaService.updateFacturacion(id, updateFacturacionDto);
   }
 
   @Delete('/facturacion/:id')
   async deleteFacturacion(@Param('id') id: string) {
     return this.veterinariaService.deleteFacturacion(id);
   }

//  Rutas para Historial Médico
  @Post('/historial-medico')
  async createHistorialMedico(@Body() createHistorialMedicoDto: CreateHistorialMedicoDto) {
    return this.veterinariaService.createHistorialMedico(createHistorialMedicoDto);
  }

  @Get('/historial-medico')
  async findAllHistorialesMedicos() {
    return this.veterinariaService.findAllHistorialesMedicos();
  }

  @Get('/historial-medico/:id')
  async findHistorialMedicoById(@Param('id') id: string) {
    return this.veterinariaService.findHistorialMedicoById(id);
  }

  @Put('/historial-medico/:id')
  async updateHistorialMedico(@Param('id') id: string, @Body() updateHistorialMedicoDto: UpdateHistorialMedicoDto) {
    return this.veterinariaService.updateHistorialMedico(id, updateHistorialMedicoDto);
  }

  @Delete('/historial-medico/:id')
  async deleteHistorialMedico(@Param('id') id: string) {
    return this.veterinariaService.deleteHistorialMedico(id);
  }

//  Rutas para Servicio Prestado
    @Post('/servicio-prestado')
    async createServicioPrestado(@Body() createServicioPrestadoDto: CreateServicioPrestadoDto) {
    return this.veterinariaService.createServicioPrestado(createServicioPrestadoDto);
    }

    @Get('/servicio-prestado')
    async findAllServiciosPrestados() {
    return this.veterinariaService.findAllServiciosPrestados();
    }

    @Get('/servicio-prestado/:id')
    async findServicioPrestadoById(@Param('id') id: string) {
    return this.veterinariaService.findServicioPrestadoById(id);
    }

    @Put('/servicio-prestado/:id')
    async updateServicioPrestado(@Param('id') id: string, @Body() updateServicioPrestadoDto: UpdateServicioPrestadoDto) {
    return this.veterinariaService.updateServicioPrestado(id, updateServicioPrestadoDto);
    }

    @Delete('/servicio-prestado/:id')
    async deleteServicioPrestado(@Param('id') id: string) {
    return this.veterinariaService.deleteServicioPrestado(id);
    }

//  Rutas para Veterinario
  @Post('/veterinario')
  async createVeterinario(@Body() createVeterinarioDto: CreateVeterinarioDto) {
    return this.veterinariaService.createVeterinario(createVeterinarioDto);
  }

  @Get('/veterinario')
  async findAllVeterinarios() {
    return this.veterinariaService.findAllVeterinarios();
  }

  @Get('/veterinario/:id')
  async findVeterinarioById(@Param('id') id: string) {
    return this.veterinariaService.findVeterinarioById(id);
  }

  @Put('/veterinario/:id')
  async updateVeterinario(@Param('id') id: string, @Body() updateVeterinarioDto: UpdateVeterinarioDto) {
    return this.veterinariaService.updateVeterinario(id, updateVeterinarioDto);
  }

  @Delete('/veterinario/:id')
  async deleteVeterinario(@Param('id') id: string) {
    return this.veterinariaService.deleteVeterinario(id);
  }
}
