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
import { CreateCitaDto } from '../dto/cita.dto/create-cita.dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/cita.dto/update-cita.dto/update-cita.dto';
import { Cita } from '../interfaces/cita/cita.interface';
import { CitaService } from '../service/cita.service';

// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class CitaController {
  constructor(private readonly citaService: CitaService) {}

  //  Rutas para Cita
  @ApiTags('Citas')
  @Get('cita')
  @ApiOperation({ summary: 'Obtiene citas de un veterinario en una fecha dada' })
  @ApiQuery({ name: 'veterinario', required: true, description: 'ID del veterinario' })
  @ApiQuery({ name: 'fecha', required: true, description: 'Fecha en formato YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Lista de citas encontradas', type: [CreateCitaDto] })
  @ApiResponse({ status: 404, description: 'Falta veterinario o fecha en la query' })
  async getCitasPorVeterinarioYFecha(
    @Query('veterinario') veterinarioId: string,
    @Query('fecha') fecha: string,
  ): Promise<Cita[]> {
    if (!veterinarioId || !fecha) {
      throw new NotFoundException('Debes proporcionar veterinario y fecha en formato YYYY-MM-DD');
    }
    const citas = await this.citaService.findCitasPorVeterinarioYFecha(veterinarioId, fecha);
    return citas;
  }

  @ApiTags('Citas')
  @Get('citas')
  @ApiOperation({ summary: 'Lista todas las citas o busca por término' })
  @ApiQuery({ name: 'search', required: false, description: 'Término para filtrar citas' })
  @ApiResponse({ status: 200, description: 'Citas retornadas', type: [CreateCitaDto] })
  async findCitas(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.citaService.findCitasByCampo(search);
    } else {
      return this.citaService.findAllCitas();
    }
  }

  @ApiTags('Citas')
  @Post('citas')
  @ApiOperation({ summary: 'Crea una nueva cita' })
  @ApiBody({ type: CreateCitaDto, description: 'Datos para crear la cita' })
  @ApiResponse({ status: 201, description: 'Cita creada', type: CreateCitaDto })
  async createCita(@Body() createCitaDto: CreateCitaDto) {
    return this.citaService.createCita(createCitaDto);
  }

  @ApiTags('Citas')
  @Get('citas/:id')
  @ApiOperation({ summary: 'Obtiene una cita por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita encontrada', type: CreateCitaDto })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async findCitaById(@Param('id') id: string) {
    return this.citaService.findCitaById(id);
  }

  @ApiTags('Citas')
  @Put('citas/:id')
  @ApiOperation({ summary: 'Actualiza una cita existente' })
  @ApiParam({ name: 'id', description: 'ID de la cita a actualizar' })
  @ApiBody({ type: UpdateCitaDto, description: 'Campos a actualizar en la cita' })
  @ApiResponse({ status: 200, description: 'Cita actualizada', type: CreateCitaDto })
  async updateCita(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citaService.updateCita(id, updateCitaDto);
  }

  @ApiTags('Citas')
  @Delete('citas/:id')
  @ApiOperation({ summary: 'Elimina una cita por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita a eliminar' })
  @ApiResponse({ status: 200, description: 'Cita eliminada' })
  async deleteCita(@Param('id') id: string) {
    return this.citaService.deleteCita(id);
  }

  @ApiTags('Citas')
  @Get('mascotas/:id/citas')
  @ApiOperation({ summary: 'Lista las citas de una mascota por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Citas de la mascota', type: [CreateCitaDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron citas para esa mascota' })
  async findCitasByMascotaId(@Param('id') mascotaId: string) {
    const citas = await this.citaService.findCitasByMascotaId(mascotaId);
    if (!citas) {
      throw new NotFoundException(`No se encontraron citas para la mascota con ID ${mascotaId}`);
    }
    return citas;
  }

  @ApiTags('Citas')
  @Delete('citas')
  @ApiOperation({ summary: 'Elimina varias citas por sus IDs' })
  @ApiBody({ type: [String], description: 'Array de IDs de citas' })
  @ApiResponse({ status: 200, description: 'Citas eliminadas' })
  async deleteMultipleCitas(@Body() ids: string[]) {
    return this.citaService.deleteMultipleCitas(ids);
  }
}
