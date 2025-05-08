import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateHistorialMedicoDto } from '../dto/create-historial-medico.dto/create-historial-medico.dto';
import { AddEntradaHistorialDto } from '../dto/historial-medico.dto/add-entrada-historial.dto';
import { HistorialMedicoDto } from '../dto/historial-medico.dto/historial-medico.dto';
import { UpdateHistorialMedicoDto } from '../dto/update-historial-medico.dto/update-historial-medico.dto';
import { HistorialMedico } from '../interfaces/historial-medico/historial-medico.interface';
import { HistorialMedicoService } from '../service/historialMedico.service';

// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class HistorialMedicoController {
  constructor(private readonly historialMedicoService: HistorialMedicoService) {}

  //  Rutas para Historial Médico
  @ApiTags('Historial Médico')
  @Post('historial-medico/:mascotaId/entrada')
  @ApiOperation({ summary: 'Agrega una entrada al historial de una mascota' })
  @ApiParam({ name: 'mascotaId', description: 'ID de la mascota' })
  @ApiBody({ type: AddEntradaHistorialDto })
  @ApiResponse({
    status: 201,
    description: 'Entrada añadida al historial',
    type: HistorialMedicoDto,
  })
  @ApiResponse({ status: 404, description: 'Mascota o historial no encontrado' })
  async agregarEntrada(
    @Param('mascotaId') mascotaId: string,
    @Body() entrada: AddEntradaHistorialDto,
  ) {
    try {
      return await this.historialMedicoService.agregarEntradaAHistorial(mascotaId, entrada);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @ApiTags('Historial Médico')
  @Post('historial-medico')
  @ApiOperation({ summary: 'Crea un historial médico para una mascota' })
  @ApiBody({ type: CreateHistorialMedicoDto })
  @ApiResponse({
    status: 201,
    description: 'Historial médico creado',
    type: HistorialMedicoDto,
  })
  async createHistorialMedico(@Body() dto: CreateHistorialMedicoDto) {
    return this.historialMedicoService.createHistorialMedico(dto);
  }

  @ApiTags('Historial Médico')
  @Get('historial-medico')
  @ApiOperation({ summary: 'Obtiene todos los historiales médicos' })
  @ApiResponse({
    status: 200,
    description: 'Listado de historiales',
    type: [HistorialMedicoDto],
  })
  async findAllHistorialesMedicos() {
    return this.historialMedicoService.findAllHistorialesMedicos();
  }

  @ApiTags('Historial Médico')
  @Get('mascotas/:id/historial-medico')
  @ApiOperation({ summary: 'Historial médico de una mascota' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({
    status: 200,
    description: 'Historial encontrado',
    type: HistorialMedicoDto,
  })
  @ApiResponse({ status: 404, description: 'Historial no encontrado para la mascota' })
  async findHistorialMedicoByMascota(@Param('id') id: string) {
    const historial = await this.historialMedicoService.findHistorialPorMascota(id);
    if (!historial) {
      throw new NotFoundException(`Historial médico no encontrado para la mascota con ID ${id}`);
    }
    return historial;
  }

  @ApiTags('Historial Médico')
  @Get('historial-medico/:id')
  @ApiOperation({ summary: 'Obtiene un historial médico por ID' })
  @ApiParam({ name: 'id', description: 'ID del historial médico' })
  @ApiResponse({
    status: 200,
    description: 'Historial médico encontrado',
    type: HistorialMedicoDto,
  })
  @ApiResponse({ status: 404, description: 'Historial no encontrado' })
  async findHistorialMedicoById(@Param('id') id: string) {
    return this.historialMedicoService.findHistorialMedicoById(id);
  }

  @ApiTags('Historial Médico')
  @Put('historial-medico/:id')
  @ApiOperation({ summary: 'Actualiza un historial médico existente' })
  @ApiParam({ name: 'id', description: 'ID del historial médico a actualizar' })
  @ApiBody({ type: UpdateHistorialMedicoDto })
  @ApiResponse({
    status: 200,
    description: 'Historial médico actualizado',
    type: HistorialMedicoDto,
  })
  async updateHistorialMedico(@Param('id') id: string, @Body() dto: UpdateHistorialMedicoDto) {
    return this.historialMedicoService.updateHistorialMedico(id, dto);
  }

  @ApiTags('Historial Médico')
  @Delete('historial-medico/:id')
  @ApiOperation({ summary: 'Elimina un historial médico por ID' })
  @ApiParam({ name: 'id', description: 'ID del historial médico a eliminar' })
  @ApiResponse({ status: 200, description: 'Historial médico eliminado' })
  async deleteHistorialMedico(@Param('id') id: string) {
    return this.historialMedicoService.deleteHistorialMedico(id);
  }

  @ApiTags('Historial Médico')
  @Delete('historial-medico')
  @ApiOperation({ summary: 'Elimina múltiples historiales médicos' })
  @ApiBody({ type: [String], description: 'Array de IDs de historiales médicos' })
  @ApiResponse({ status: 200, description: 'Historiales médicos eliminados' })
  async deleteMultipleHistorialMedico(@Body() ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error('No historial IDs provided for deletion.');
    }
    return this.historialMedicoService.deleteMultipleHistorialMedico(ids);
  }

  @ApiTags('Historial Médico')
  @Put('historial-medico/:historialId/entrada/:entradaId')
  @ApiOperation({ summary: 'Actualiza una entrada específica del historial médico' })
  @ApiParam({ name: 'historialId', description: 'ID del historial médico que contiene la entrada' })
  @ApiParam({ name: 'entradaId', description: 'ID de la entrada a modificar' })
  @ApiBody({ type: AddEntradaHistorialDto })
  @ApiResponse({
    status: 200,
    description: 'Entrada actualizada con éxito',
    type: HistorialMedicoDto,
  })
  @ApiResponse({ status: 404, description: 'Historial o entrada no encontrado' })
  async updateEntrada(
    @Param('historialId') historialId: string,
    @Param('entradaId') entradaId: string,
    @Body() entradaDto: AddEntradaHistorialDto,
  ): Promise<HistorialMedico> {
    return this.historialMedicoService.updateEntrada(historialId, entradaId, entradaDto);
  }

  @ApiTags('Historial Médico')
  @Delete('historial-medico/:historialId/entrada/:entradaId')
  @ApiOperation({ summary: 'Elimina una entrada específica del historial médico' })
  @ApiParam({ name: 'historialId', description: 'ID del historial médico que contiene la entrada' })
  @ApiParam({ name: 'entradaId', description: 'ID de la entrada a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Entrada eliminada con éxito',
    type: HistorialMedicoDto, // <-- aquí
  })
  async deleteEntrada(
    @Param('historialId') historialId: string,
    @Param('entradaId') entradaId: string,
  ): Promise<HistorialMedico> {
    // <-- y aquí
    return this.historialMedicoService.deleteEntrada(historialId, entradaId);
  }
}
