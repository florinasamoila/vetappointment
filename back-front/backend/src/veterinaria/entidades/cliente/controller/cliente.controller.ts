import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody
} from '@nestjs/swagger';
import { ClienteDto } from '../dto/cliente.dto/cliente.dto';
import { CreateClienteDto } from '../dto/create-cliente.dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto/update-cliente.dto';
import { ClienteService } from '../service/cliente.service';


// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) {}

//  Rutas para Clientes

  @ApiTags('Clientes')
  @Post('clientes')
  @ApiOperation({ summary: 'Crea un nuevo cliente con al menos una mascota' })
  @ApiBody({ type: CreateClienteDto })
  @ApiResponse({ status: 201, description: 'Cliente creado', type: ClienteDto })
  @ApiResponse({ status: 400, description: 'Falta al menos una mascota' })
  async createCliente(
    @Body() createClienteDto: CreateClienteDto,
  ): Promise<ClienteDto> {
    if (!createClienteDto.mascotas || createClienteDto.mascotas.length === 0) {
      throw new Error('At least one mascota must be provided.');
    }
    return this.clienteService.createCliente(createClienteDto);
  }

  @ApiTags('Clientes')
  @Get('clientes')
  @ApiOperation({ summary: 'Obtiene todos los clientes o busca por término' })
  @ApiQuery({ name: 'search', required: false, description: 'Término para búsqueda' })
  @ApiResponse({ status: 200, description: 'Lista de clientes', type: [ClienteDto] })
  async findClientes(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.clienteService.findClientByName(search);
    }
    return this.clienteService.findAllClientes();
  }
  
  @ApiTags('Clientes')
  @Get('clientes/:id')
  @ApiOperation({ summary: 'Obtiene un cliente por su ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado', type: ClienteDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getClienteById(@Param('id') id: string): Promise<ClienteDto> {
    return this.clienteService.findClienteById(id);
  }

  @ApiTags('Clientes')
  @Put('clientes/:id')
  @ApiOperation({ summary: 'Actualiza un cliente existente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiBody({ type: UpdateClienteDto })
  @ApiResponse({ status: 200, description: 'Cliente actualizado', type: ClienteDto })
  async updateCliente(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.updateCliente(id, updateClienteDto);
  }

  @ApiTags('Clientes')
  @Delete('clientes/:id')
  @ApiOperation({ summary: 'Elimina un cliente por su ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado' })
  async deleteCliente(@Param('id') id: string) {
    return this.clienteService.deleteCliente(id);
  }

  @ApiTags('Clientes')
  @Delete('clientes')
  @ApiOperation({ summary: 'Elimina múltiples clientes en cascada' })
  @ApiBody({ type: [String], description: 'Array de IDs de clientes' })
  @ApiResponse({ status: 200, description: 'Clientes eliminados' })
  async deleteMultipleClientes(@Body() ids: string[]) {
    return this.clienteService.deleteMultipleClientes(ids);
  }
}