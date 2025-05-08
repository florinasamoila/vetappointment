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
import { MascotaService } from '../service/mascota.service';
import { CreateHistorialMedicoDto } from '../../historial-medico/dto/create-historial-medico.dto/create-historial-medico.dto';
import { AddEntradaHistorialDto } from '../../historial-medico/dto/historial-medico.dto/add-entrada-historial.dto';
import { HistorialMedicoDto } from '../../historial-medico/dto/historial-medico.dto/historial-medico.dto';
import { UpdateHistorialMedicoDto } from '../../historial-medico/dto/update-historial-medico.dto/update-historial-medico.dto';
import { HistorialMedico } from '../../historial-medico/interfaces/historial-medico/historial-medico.interface';
import { CreateMascotaDto } from '../dto/create-mascota.dto/create-mascota.dto';
import { MascotaDto } from '../dto/mascota.dto/mascota.dto';
import { UpdateMascotaDto } from '../dto/update-mascota.dto/update-mascota.dto';
import { Mascota } from '../interfaces/mascota/mascota.interface';

// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class MascotaController {
  constructor(private readonly mascotaService: MascotaService) {}

  //  Rutas para Mascotas
  @ApiTags('Mascotas')
  @Get('clientes/:id/mascotas')
  @ApiOperation({ summary: 'Lista las mascotas de un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Mascotas del cliente', type: [CreateMascotaDto] })
  async findMascotasByClienteId(@Param('id') id: string) {
    return this.mascotaService.findMascotasByClienteId(id);
  }

  @ApiTags('Mascotas')
  @Get('mascotas')
  @ApiOperation({ summary: 'Obtiene todas las mascotas o busca por nombre' })
  @ApiQuery({ name: 'search', required: false, description: 'Término para búsqueda' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas', type: [CreateMascotaDto] })
  async findMascotas(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.mascotaService.findMascotaByNombre(search);
    }
    return this.mascotaService.findAllMascotas();
  }

  @ApiTags('Mascotas')
  @Post('mascotas')
  @ApiOperation({ summary: 'Crea una nueva mascota' })
  @ApiBody({ type: CreateMascotaDto })
  @ApiResponse({ status: 201, description: 'Mascota creada', type: CreateMascotaDto })
  async createMascota(@Body() dto: CreateMascotaDto): Promise<Mascota> {
    return this.mascotaService.createMascota(dto);
  }

  @ApiTags('Mascotas')
  @Get('mascotas/:id')
  @ApiOperation({ summary: 'Obtiene una mascota por ID' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota encontrada', type: CreateMascotaDto })
  async findMascotaById(@Param('id') id: string) {
    return this.mascotaService.findMascotaById(id);
  }

  @ApiTags('Mascotas')
  @Put('mascotas/:id')
  @ApiOperation({ summary: 'Actualiza una mascota' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiBody({ type: UpdateMascotaDto })
  @ApiResponse({ status: 200, description: 'Mascota actualizada', type: CreateMascotaDto })
  async updateMascota(@Param('id') id: string, @Body() dto: UpdateMascotaDto) {
    return this.mascotaService.updateMascota(id, dto);
  }

  @ApiTags('Mascotas')
  @Delete('mascotas/:id')
  @ApiOperation({ summary: 'Elimina una mascota por ID' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota eliminada' })
  async deleteMascota(@Param('id') id: string) {
    return this.mascotaService.deleteMascota(id);
  }

  @ApiTags('Mascotas')
  @Delete('mascotas')
  @ApiOperation({ summary: 'Elimina múltiples mascotas' })
  @ApiBody({ type: [String], description: 'Array de IDs de mascotas' })
  @ApiResponse({ status: 200, description: 'Mascotas eliminadas' })
  async deleteMultipleMascotas(@Body() ids: string[]) {
    return this.mascotaService.deleteMultipleMascotas(ids);
  }

  @ApiTags('Mascotas')
  @Post('clientes/:id/mascota')
  @ApiOperation({ summary: 'Agrega una nueva mascota a un cliente existente' })
  @ApiParam({ name: 'id', description: 'ID del cliente al que se agregará la mascota' })
  @ApiBody({ type: CreateMascotaDto, description: 'Datos de la mascota a crear' })
  @ApiResponse({
    status: 201,
    description: 'Mascota creada y asociada al cliente',
    type: MascotaDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async agregarMascotaACliente(
    @Param('id') clienteId: string,
    @Body() createMascotaDto: CreateMascotaDto,
  ) {
    return await this.mascotaService.agregarMascotaACliente(clienteId, createMascotaDto);
  }
}
