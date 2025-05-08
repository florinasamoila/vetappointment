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
import { ServicioPrestadoService } from '../service/servicio-prestado.service';
import { CreateServicioPrestadoDto } from '../dto/create-servicio-prestado.dto/create-servicio-prestado.dto';
import { ServicioPrestadoDto } from '../dto/servicio-prestado.dto/servicio-prestado.dto';
import { UpdateServicioPrestadoDto } from '../dto/update-servicio-prestado.dto/update-servicio-prestado.dto';
import { ServicioPrestado } from '../interfaces/servicio-prestado/servicio-prestado.interface';





// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class ServicioPrestadoController {
    constructor(private readonly servicioPrestadoService: ServicioPrestadoService) {}

    //  Rutas para Servicio Prestado
      @ApiTags('Servicios Prestados')
      @Get('servicio-prestado')
      @ApiOperation({ summary: 'Obtiene todos los servicios prestados o filtra por nombre' })
      @ApiQuery({
        name: 'search',
        required: false,
        description: 'Término para búsqueda en nombre o descripción'
      })
      @ApiResponse({
        status: 200,
        description: 'Lista de servicios prestados',
        type: [ServicioPrestadoDto]
      })
      async findServiciosPrestados(
        @Query('search') search?: string
      ): Promise<ServicioPrestado[]> {
        if (search && search.trim() !== '') {
          return this.servicioPrestadoService.findServicioByNombre(search);
        } else {
          return this.servicioPrestadoService.findAllServiciosPrestados();
        }
      }
    
      @ApiTags('Servicios Prestados')
      @Post('servicio-prestado')
      @ApiOperation({ summary: 'Crea un nuevo servicio prestado' })
      @ApiBody({ type: CreateServicioPrestadoDto })
      @ApiResponse({
        status: 201,
        description: 'Servicio prestado creado',
        type: ServicioPrestadoDto
      })
      async createServicioPrestado(
        @Body() createServicioPrestadoDto: CreateServicioPrestadoDto
      ): Promise<ServicioPrestado> {
        return this.servicioPrestadoService.createServicioPrestado(createServicioPrestadoDto);
      }
    
      @ApiTags('Servicios Prestados')
      @Get('servicio-prestado')
      @ApiOperation({ summary: 'Obtiene todos los servicios prestados' })
      @ApiResponse({
        status: 200,
        description: 'Lista completa de servicios prestados',
        type: [ServicioPrestadoDto]
      })
      async findAllServiciosPrestados(): Promise<ServicioPrestado[]> {
        return this.servicioPrestadoService.findAllServiciosPrestados();
      }
    
      @ApiTags('Servicios Prestados')
      @Get('servicio-prestado/:id')
      @ApiOperation({ summary: 'Obtiene un servicio prestado por su ID' })
      @ApiParam({ name: 'id', description: 'ID del servicio prestado' })
      @ApiResponse({
        status: 200,
        description: 'Servicio prestado encontrado',
        type: ServicioPrestadoDto
      })
      async findServicioPrestadoById(
        @Param('id') id: string
      ): Promise<ServicioPrestado> {
        return this.servicioPrestadoService.findServicioPrestadoById(id);
      }
    
      @ApiTags('Servicios Prestados')
      @Put(':servicio-prestado/:id')
      @ApiOperation({ summary: 'Actualiza un servicio prestado existente' })
      @ApiParam({ name: 'id', description: 'ID del servicio prestado' })
      @ApiBody({ type: UpdateServicioPrestadoDto })
      @ApiResponse({
        status: 200,
        description: 'Servicio prestado actualizado',
        type: ServicioPrestadoDto
      })
      async updateServicioPrestado(
        @Param('id') id: string,
        @Body() updateServicioPrestadoDto: UpdateServicioPrestadoDto
      ): Promise<ServicioPrestado> {
        return this.servicioPrestadoService.updateServicioPrestado(id, updateServicioPrestadoDto);
      }
    
      @ApiTags('Servicios Prestados')
      @Delete('servicio-prestado/:id')
      @ApiOperation({ summary: 'Elimina un servicio prestado por su ID' })
      @ApiParam({ name: 'id', description: 'ID del servicio prestado' })
      @ApiResponse({ status: 200, description: 'Servicio prestado eliminado' })
      async deleteServicioPrestado(@Param('id') id: string): Promise<ServicioPrestado> {
        return this.servicioPrestadoService.deleteServicioPrestado(id);
      }
    
      @ApiTags('Servicios Prestados')
      @Delete('servicio-prestado')
      @ApiOperation({ summary: 'Elimina múltiples servicios prestados' })
      @ApiBody({
        description: 'Array de IDs de servicios prestados a eliminar',
        type: [String]
      })
      @ApiResponse({ status: 200, description: 'Servicios prestados eliminados' })
      async deleteMultipleServiciosPrestados(
        @Body() ids: string[]
      ): Promise<void> {
        if (!ids || ids.length === 0) {
          throw new Error('No servicio IDs provided for deletion.');
        }
        await this.servicioPrestadoService.deleteMultipleServiciosPrestados(ids);
        return;
      }
}