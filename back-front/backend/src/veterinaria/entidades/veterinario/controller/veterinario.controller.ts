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
import { CreateVeterinarioDto } from '../dto/create-veterinario.dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from '../dto/update-veterinario.dto/update-veterinario.dto';
import { VeterinarioDto } from '../dto/veterinario.dto/veterinario.dto';
import { Veterinario } from '../interfaces/veterinario/veterinario.interface';
import { VeterinarioService } from '../service/veterinario.service';

// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class VeterinarioController {
  constructor(private readonly veterinarioService: VeterinarioService) {}
  //  Rutas para Veterinario

  @ApiTags('Veterinarios')
  @Get('veterinario')
  @ApiOperation({ summary: 'Obtiene todos los veterinarios o filtra por nombre/apellido' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Término para búsqueda de veterinarios',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de veterinarios',
    type: [VeterinarioDto],
  })
  async findVeterinarios(@Query('search') search?: string): Promise<Veterinario[]> {
    if (search && search.trim() !== '') {
      return this.veterinarioService.findVeterinarioByNombre(search);
    } else {
      return this.veterinarioService.findAllVeterinarios();
    }
  }

  @ApiTags('Veterinarios')
  @Post('veterinario')
  @ApiOperation({ summary: 'Crea un nuevo veterinario' })
  @ApiBody({ type: CreateVeterinarioDto })
  @ApiResponse({
    status: 201,
    description: 'Veterinario creado',
    type: VeterinarioDto,
  })
  async createVeterinario(
    @Body() createVeterinarioDto: CreateVeterinarioDto,
  ): Promise<Veterinario> {
    return this.veterinarioService.createVeterinario(createVeterinarioDto);
  }

  @ApiTags('Veterinarios')
  @Get('veterinario/:id')
  @ApiOperation({ summary: 'Obtiene un veterinario por su ID' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiResponse({
    status: 200,
    description: 'Veterinario encontrado',
    type: VeterinarioDto,
  })
  @ApiResponse({ status: 404, description: 'Veterinario no encontrado' })
  async findVeterinarioById(@Param('id') id: string): Promise<Veterinario> {
    return this.veterinarioService.findVeterinarioById(id);
  }

  @ApiTags('Veterinarios')
  @Put('veterinario/:id')
  @ApiOperation({ summary: 'Actualiza un veterinario por su ID' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiBody({ type: UpdateVeterinarioDto })
  @ApiResponse({
    status: 200,
    description: 'Veterinario actualizado',
    type: VeterinarioDto,
  })
  async updateVeterinario(
    @Param('id') id: string,
    @Body() updateVeterinarioDto: UpdateVeterinarioDto,
  ): Promise<Veterinario> {
    return this.veterinarioService.updateVeterinario(id, updateVeterinarioDto);
  }

  @ApiTags('Veterinarios')
  @Delete('veterinario/:id')
  @ApiOperation({ summary: 'Elimina un veterinario por su ID' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Veterinario eliminado' })
  async deleteVeterinario(@Param('id') id: string): Promise<Veterinario> {
    return this.veterinarioService.deleteVeterinario(id);
  }

  @ApiTags('Veterinarios')
  @Delete('veterinario')
  @ApiOperation({ summary: 'Elimina múltiples veterinarios' })
  @ApiBody({
    description: 'Array de IDs de veterinarios a eliminar',
    type: [String],
  })
  @ApiResponse({ status: 200, description: 'Veterinarios eliminados' })
  async deleteMultipleVeterinarios(@Body() ids: string[]): Promise<Veterinario[]> {
    if (!ids || ids.length === 0) {
      throw new Error('No veterinario IDs provided for deletion.');
    }
    return this.veterinarioService.deleteMultipleVeterinarios(ids);
  }
}
