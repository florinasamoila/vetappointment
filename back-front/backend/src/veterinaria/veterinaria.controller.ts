import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
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
import { AddEntradaHistorialDto } from './dto/historial-medico.dto/add-entrada-historial.dto';
import { CreateVeterinarioDto } from './dto-create/create-veterinario.dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from './dto-update/update-veterinario.dto/update-veterinario.dto';
import { ClienteDto } from './dto/cliente.dto/cliente.dto';
import { Mascota } from './interfaces/mascota/mascota.interface';
import { HistorialMedico } from './interfaces/historial-medico/historial-medico.interface';
import { Cita } from './interfaces/cita/cita.interface';

// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class VeterinariaController {
    constructor(private readonly veterinariaService: VeterinariaService) {}

//  Rutas para Clientes
// Route to create a new Cliente along with at least one Mascota
@Post('clientes')
async createCliente(
  @Body() createClienteDto: CreateClienteDto,   // ← Aquí el @Body()
): Promise<ClienteDto> {
  if (!createClienteDto.mascotas || createClienteDto.mascotas.length === 0) {
    throw new Error('At least one mascota must be provided.');
  }
  return this.veterinariaService.createCliente(createClienteDto);
}

  @Get('clientes')
  async findClientes(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.veterinariaService.findClientByName(search);
    } else {
      return this.veterinariaService.findAllClientes();
    }
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

  @Delete('/clientes')
async deleteMultipleClientes(@Body() ids: string[]) {
  if (!ids || ids.length === 0) {
    throw new Error('No client IDs provided for deletion.');
  }

  return this.veterinariaService.deleteMultipleClientes(ids);
}

//  Rutas para Mascotas


@Get('clientes/:id/mascotas')
async findMascotasByClienteId(@Param('id') id: string) {
  return this.veterinariaService.findMascotasByClienteId(id);
}

@Get('mascotas')
async findMascotas(@Query('search') search?: string) {
  if (search && search.trim() !== '') {
    return this.veterinariaService.findMascotaByNombre(search);
  } else {
    return this.veterinariaService.findAllMascotas();
  }
}


@Post('mascotas')
async createMascota(@Body() createMascotaDto: CreateMascotaDto): Promise<Mascota> {
  return this.veterinariaService.createMascota(createMascotaDto);
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

  // Rutas para eliminar múltiples Mascotas
@Delete('/mascotas')
async deleteMultipleMascotas(@Body() ids: string[]) {
  if (!ids || ids.length === 0) {
    throw new Error('No mascota IDs provided for deletion.');
  }

  return this.veterinariaService.deleteMultipleMascotas(ids);
}

// src/veterinaria/veterinaria.controller.ts
@Post('clientes/:id/mascota')
async agregarMascotaACliente(
  @Param('id') clienteId: string,
  @Body() createMascotaDto: CreateMascotaDto
) {
  return await this.veterinariaService.agregarMascotaACliente(clienteId, createMascotaDto);
}

//  Rutas para Cita

@Get('cita')
async getCitasPorVeterinarioYFecha(
  @Query('veterinario') veterinarioId: string,
  @Query('fecha') fecha: string,
): Promise<Cita[]> {
  if (!veterinarioId || !fecha) {
    throw new NotFoundException('Debes proporcionar veterinario y fecha en formato YYYY-MM-DD');
  }
  const citas = await this.veterinariaService.findCitasPorVeterinarioYFecha(veterinarioId, fecha);
  // Si prefieres, devuelve array vacío en vez de 404 cuando no haya citas:
  // if (citas.length === 0) return [];
  return citas;
}

@Get('citas')
async findCitas(@Query('search') search?: string) {
  if (search && search.trim() !== '') {
    return this.veterinariaService.findCitasByCampo(search);
  } else {
    return this.veterinariaService.findAllCitas();
  }
}


  @Post('/citas')
  async createCita(@Body() createCitaDto: CreateCitaDto) {
    return this.veterinariaService.createCita(createCitaDto);
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

  @Get('mascotas/:id/citas')
  async findCitasByMascotaId(@Param('id') mascotaId: string) {
    const citas = await this.veterinariaService.findCitasByMascotaId(mascotaId);
    if (!citas) {
      throw new NotFoundException(`No se encontraron citas para la mascota con ID ${mascotaId}`);
    }
    return citas;
  }

  @Delete('/citas')
async deleteMultipleCitas(@Body() ids: string[]) {
  if (!ids || ids.length === 0) {
    throw new Error('No cita IDs provided for deletion.');
  }

  return this.veterinariaService.deleteMultipleCitas(ids);
}

//  Rutas para facturacion

@Get('facturacion')
async findFacturacionByConcepto(@Query('search') search: string) {
  return this.veterinariaService.findFacturacionByConcepto(search);
}
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

  // Ruta para agregar una entrada al historial de la mascota
  @Post('historial-medico/:mascotaId/entrada')
  async agregarEntrada(
    @Param('mascotaId') mascotaId: string,
    @Body() entrada: AddEntradaHistorialDto,
  ) {
    try {
      return await this.veterinariaService.agregarEntradaAHistorial(mascotaId, entrada);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('historial-medico')
  async createHistorialMedico(@Body() createHistorialMedicoDto: CreateHistorialMedicoDto) {
    return this.veterinariaService.createHistorialMedico(createHistorialMedicoDto);
  }

  @Get('historial-medico')
  async findAllHistorialesMedicos() {
    return this.veterinariaService.findAllHistorialesMedicos();
  }
  
// Ruta para obtener historial médico de una mascota
// veterinaria.controller.ts

@Get('mascotas/:id/historial-medico')
async findHistorialMedicoByMascota(@Param('id') id: string) {
  const historial = await this.veterinariaService.findHistorialPorMascota(id);
  if (!historial) {
    throw new NotFoundException(`Historial médico no encontrado para la mascota con ID ${id}`);
  }
  return historial;
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

  @Delete('/historial-medico')
async deleteMultipleHistorialMedico(@Body() ids: string[]) {
  if (!ids || ids.length === 0) {
    throw new Error('No historial IDs provided for deletion.');
  }

  return this.veterinariaService.deleteMultipleHistorialMedico(ids);
}

// Duplicate function removed to resolve the error


//  Rutas para Servicio Prestado
  @Get('servicio-prestado')
async findServiciosPrestados(@Query('search') search?: string) {
  if (search && search.trim() !== '') {
    return this.veterinariaService.findServicioByNombre(search);
  } else {
    return this.veterinariaService.findAllServiciosPrestados();
  }
}
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

    @Delete('/servicio-prestado')
async deleteMultipleServiciosPrestados(@Body() ids: string[]) {
  if (!ids || ids.length === 0) {
    throw new Error('No servicio IDs provided for deletion.');
  }

  return this.veterinariaService.deleteMultipleServiciosPrestados(ids);
}

//  Rutas para Veterinario

  @Get('/veterinario')
  async findVeterinarios(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.veterinariaService.findVeterinarioByNombre(search);
    } else {
      return this.veterinariaService.findAllVeterinarios();
    }
  }

  @Post('/veterinario')
  async createVeterinario(@Body() createVeterinarioDto: CreateVeterinarioDto) {
    return this.veterinariaService.createVeterinario(createVeterinarioDto);
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

  @Delete('/veterinario')
async deleteMultipleVeterinarios(@Body() ids: string[]) {
  if (!ids || ids.length === 0) {
    throw new Error('No veterinario IDs provided for deletion.');
  }

  return this.veterinariaService.deleteMultipleVeterinarios(ids);
}
}
