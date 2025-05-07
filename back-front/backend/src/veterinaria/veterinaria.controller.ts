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
import { AddEntradaHistorialDto } from './dto/historial-medico.dto/add-entrada-historial.dto';
import { CreateServicioPrestadoDto } from './dto-create/create-servicio-prestado.dto/create-servicio-prestado.dto';
import { UpdateServicioPrestadoDto } from './dto-update/update-servicio-prestado.dto/update-servicio-prestado.dto';
import { CreateVeterinarioDto } from './dto-create/create-veterinario.dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from './dto-update/update-veterinario.dto/update-veterinario.dto';
import { ClienteDto } from './dto/cliente.dto/cliente.dto';
import { Mascota } from './interfaces/mascota/mascota.interface';
import { Cita } from './interfaces/cita/cita.interface';
import { HistorialMedico } from './interfaces/historial-medico/historial-medico.interface';
import { MascotaDto } from './dto/mascota.dto/mascota.dto';
import { FacturacionDto } from './dto/facturacion.dto/facturacion.dto';
import { HistorialMedicoDto } from './dto/historial-medico.dto/historial-medico.dto';
import { ServicioPrestadoDto } from './dto/servicio-prestado.dto/servicio-prestado.dto';
import { ServicioPrestado } from './interfaces/servicio-prestado/servicio-prestado.interface';
import { VeterinarioDto } from './dto/veterinario.dto/veterinario.dto';
import { Veterinario } from './interfaces/veterinario/veterinario.interface';

// Todas las RUTAS están comentadas por categoría, para encontrarlas más fácilmente.

@Controller('veterinaria')
export class VeterinariaController {
    constructor(private readonly veterinariaService: VeterinariaService) {}

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
    return this.veterinariaService.createCliente(createClienteDto);
  }

  @ApiTags('Clientes')
  @Get('clientes')
  @ApiOperation({ summary: 'Obtiene todos los clientes o busca por término' })
  @ApiQuery({ name: 'search', required: false, description: 'Término para búsqueda' })
  @ApiResponse({ status: 200, description: 'Lista de clientes', type: [ClienteDto] })
  async findClientes(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.veterinariaService.findClientByName(search);
    }
    return this.veterinariaService.findAllClientes();
  }
  
  @ApiTags('Clientes')
  @Get('clientes/:id')
  @ApiOperation({ summary: 'Obtiene un cliente por su ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado', type: ClienteDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getClienteById(@Param('id') id: string): Promise<ClienteDto> {
    return this.veterinariaService.findClienteById(id);
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
    return this.veterinariaService.updateCliente(id, updateClienteDto);
  }

  @ApiTags('Clientes')
  @Delete('clientes/:id')
  @ApiOperation({ summary: 'Elimina un cliente por su ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado' })
  async deleteCliente(@Param('id') id: string) {
    return this.veterinariaService.deleteCliente(id);
  }

  @ApiTags('Clientes')
  @Delete('clientes')
  @ApiOperation({ summary: 'Elimina múltiples clientes en cascada' })
  @ApiBody({ type: [String], description: 'Array de IDs de clientes' })
  @ApiResponse({ status: 200, description: 'Clientes eliminados' })
  async deleteMultipleClientes(@Body() ids: string[]) {
    return this.veterinariaService.deleteMultipleClientes(ids);
  }

  //  Rutas para Mascotas
  @ApiTags('Mascotas')
  @Get('clientes/:id/mascotas')
  @ApiOperation({ summary: 'Lista las mascotas de un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Mascotas del cliente', type: [CreateMascotaDto] })
  async findMascotasByClienteId(@Param('id') id: string) {
    return this.veterinariaService.findMascotasByClienteId(id);
  }

  @ApiTags('Mascotas')
  @Get('mascotas')
  @ApiOperation({ summary: 'Obtiene todas las mascotas o busca por nombre' })
  @ApiQuery({ name: 'search', required: false, description: 'Término para búsqueda' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas', type: [CreateMascotaDto] })
  async findMascotas(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.veterinariaService.findMascotaByNombre(search);
    }
    return this.veterinariaService.findAllMascotas();
  }

  @ApiTags('Mascotas')
  @Post('mascotas')
  @ApiOperation({ summary: 'Crea una nueva mascota' })
  @ApiBody({ type: CreateMascotaDto })
  @ApiResponse({ status: 201, description: 'Mascota creada', type: CreateMascotaDto })
  async createMascota(@Body() dto: CreateMascotaDto): Promise<Mascota> {
    return this.veterinariaService.createMascota(dto);
  }

  @ApiTags('Mascotas')
  @Get('mascotas/:id')
  @ApiOperation({ summary: 'Obtiene una mascota por ID' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota encontrada', type: CreateMascotaDto })
  async findMascotaById(@Param('id') id: string) {
    return this.veterinariaService.findMascotaById(id);
  }

  @ApiTags('Mascotas')
  @Put('mascotas/:id')
  @ApiOperation({ summary: 'Actualiza una mascota' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiBody({ type: UpdateMascotaDto })
  @ApiResponse({ status: 200, description: 'Mascota actualizada', type: CreateMascotaDto })
  async updateMascota(
    @Param('id') id: string,
    @Body() dto: UpdateMascotaDto,
  ) {
    return this.veterinariaService.updateMascota(id, dto);
  }

  @ApiTags('Mascotas')
  @Delete('mascotas/:id')
  @ApiOperation({ summary: 'Elimina una mascota por ID' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota eliminada' })
  async deleteMascota(@Param('id') id: string) {
    return this.veterinariaService.deleteMascota(id);
  }

  @ApiTags('Mascotas')
  @Delete('mascotas')
  @ApiOperation({ summary: 'Elimina múltiples mascotas' })
  @ApiBody({ type: [String], description: 'Array de IDs de mascotas' })
  @ApiResponse({ status: 200, description: 'Mascotas eliminadas' })
  async deleteMultipleMascotas(@Body() ids: string[]) {
    return this.veterinariaService.deleteMultipleMascotas(ids);
  }

  @ApiTags('Mascotas')
  @Post('clientes/:id/mascota')
  @ApiOperation({ summary: 'Agrega una nueva mascota a un cliente existente' })
  @ApiParam({ name: 'id', description: 'ID del cliente al que se agregará la mascota' })
  @ApiBody({ type: CreateMascotaDto, description: 'Datos de la mascota a crear' })
  @ApiResponse({
    status: 201,
    description: 'Mascota creada y asociada al cliente',
    type: MascotaDto
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async agregarMascotaACliente(
    @Param('id') clienteId: string,
    @Body() createMascotaDto: CreateMascotaDto
  ) {
    return await this.veterinariaService.agregarMascotaACliente(clienteId, createMascotaDto);
  }

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
    const citas = await this.veterinariaService.findCitasPorVeterinarioYFecha(veterinarioId, fecha);
    return citas;
  }

  @ApiTags('Citas')
  @Get('citas')
  @ApiOperation({ summary: 'Lista todas las citas o busca por término' })
  @ApiQuery({ name: 'search', required: false, description: 'Término para filtrar citas' })
  @ApiResponse({ status: 200, description: 'Citas retornadas', type: [CreateCitaDto] })
  async findCitas(@Query('search') search?: string) {
    if (search && search.trim() !== '') {
      return this.veterinariaService.findCitasByCampo(search);
    } else {
      return this.veterinariaService.findAllCitas();
    }
  }

  @ApiTags('Citas')
  @Post('citas')
  @ApiOperation({ summary: 'Crea una nueva cita' })
  @ApiBody({ type: CreateCitaDto, description: 'Datos para crear la cita' })
  @ApiResponse({ status: 201, description: 'Cita creada', type: CreateCitaDto })
  async createCita(@Body() createCitaDto: CreateCitaDto) {
    return this.veterinariaService.createCita(createCitaDto);
  }

  @ApiTags('Citas')
  @Get('citas/:id')
  @ApiOperation({ summary: 'Obtiene una cita por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita encontrada', type: CreateCitaDto })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  async findCitaById(@Param('id') id: string) {
    return this.veterinariaService.findCitaById(id);
  }

  @ApiTags('Citas')
  @Put('citas/:id')
  @ApiOperation({ summary: 'Actualiza una cita existente' })
  @ApiParam({ name: 'id', description: 'ID de la cita a actualizar' })
  @ApiBody({ type: UpdateCitaDto, description: 'Campos a actualizar en la cita' })
  @ApiResponse({ status: 200, description: 'Cita actualizada', type: CreateCitaDto })
  async updateCita(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.veterinariaService.updateCita(id, updateCitaDto);
  }

  @ApiTags('Citas')
  @Delete('citas/:id')
  @ApiOperation({ summary: 'Elimina una cita por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita a eliminar' })
  @ApiResponse({ status: 200, description: 'Cita eliminada' })
  async deleteCita(@Param('id') id: string) {
    return this.veterinariaService.deleteCita(id);
  }

  @ApiTags('Citas')
  @Get('mascotas/:id/citas')
  @ApiOperation({ summary: 'Lista las citas de una mascota por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Citas de la mascota', type: [CreateCitaDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron citas para esa mascota' })
  async findCitasByMascotaId(@Param('id') mascotaId: string) {
    const citas = await this.veterinariaService.findCitasByMascotaId(mascotaId);
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
    return this.veterinariaService.deleteMultipleCitas(ids);
  }

  //  Rutas para facturacion

  @ApiTags('Facturación')
  @Get('facturacion')
  @ApiOperation({ summary: 'Busca facturación por concepto' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Término para filtrar facturación por concepto'
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de facturas que coinciden',
    type: [FacturacionDto]
  })
  async findFacturacionByConcepto(@Query('search') search: string) {
    return this.veterinariaService.findFacturacionByConcepto(search);
  }

  @ApiTags('Facturación')
  @Post('facturacion')
  @ApiOperation({ summary: 'Crea un nuevo registro de facturación' })
  @ApiBody({ type: CreateFacturacionDto })
  @ApiResponse({
    status: 201,
    description: 'Facturación creada',
    type: FacturacionDto
  })
  async createFacturacion(@Body() createFacturacionDto: CreateFacturacionDto) {
    return this.veterinariaService.createFacturacion(createFacturacionDto);
  }
 
  @ApiTags('Facturación')
  @Get('facturacion')
  @ApiOperation({ summary: 'Obtiene todas las facturaciones' })
  @ApiResponse({
    status: 200,
    description: 'Listado completo de facturación',
    type: [FacturacionDto]
  })
  async findAllFacturacion() {
    return this.veterinariaService.findAllFacturacion();
  }

  @ApiTags('Facturación')
  @Get('facturacion/:id')
  @ApiOperation({ summary: 'Obtiene una facturación por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la facturación' })
  @ApiResponse({
    status: 200,
    description: 'Facturación encontrada',
    type: FacturacionDto
  })
  async findFacturacionById(@Param('id') id: string) {
    return this.veterinariaService.findFacturacionById(id);
  }

  @ApiTags('Facturación')
  @Put('facturacion/:id')
  @ApiOperation({ summary: 'Actualiza una facturación existente' })
  @ApiParam({ name: 'id', description: 'ID de la facturación a actualizar' })
  @ApiBody({ type: UpdateFacturacionDto })
  @ApiResponse({
    status: 200,
    description: 'Facturación actualizada',
    type: FacturacionDto
  })
  async updateFacturacion(
    @Param('id') id: string,
    @Body() updateFacturacionDto: UpdateFacturacionDto
  ) {
    return this.veterinariaService.updateFacturacion(id, updateFacturacionDto);
  }

  @ApiTags('Facturación')
  @Delete('facturacion/:id')
  @ApiOperation({ summary: 'Elimina una facturación por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la facturación a eliminar' })
  @ApiResponse({ status: 200, description: 'Facturación eliminada' })
  async deleteFacturacion(@Param('id') id: string) {
    return this.veterinariaService.deleteFacturacion(id);
  }


  //  Rutas para Historial Médico
  @ApiTags('Historial Médico')
  @Post('historial-medico/:mascotaId/entrada')
  @ApiOperation({ summary: 'Agrega una entrada al historial de una mascota' })
  @ApiParam({ name: 'mascotaId', description: 'ID de la mascota' })
  @ApiBody({ type: AddEntradaHistorialDto })
  @ApiResponse({
    status: 201,
    description: 'Entrada añadida al historial',
    type: HistorialMedicoDto
  })
  @ApiResponse({ status: 404, description: 'Mascota o historial no encontrado' })
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

  @ApiTags('Historial Médico')
  @Post('historial-medico')
  @ApiOperation({ summary: 'Crea un historial médico para una mascota' })
  @ApiBody({ type: CreateHistorialMedicoDto })
  @ApiResponse({
    status: 201,
    description: 'Historial médico creado',
    type: HistorialMedicoDto
  })
  async createHistorialMedico(@Body() dto: CreateHistorialMedicoDto) {
    return this.veterinariaService.createHistorialMedico(dto);
  }

  @ApiTags('Historial Médico')
  @Get('historial-medico')
  @ApiOperation({ summary: 'Obtiene todos los historiales médicos' })
  @ApiResponse({
    status: 200,
    description: 'Listado de historiales',
    type: [HistorialMedicoDto]
  })
  async findAllHistorialesMedicos() {
    return this.veterinariaService.findAllHistorialesMedicos();
  }

  
  @ApiTags('Historial Médico')
  @Get('mascotas/:id/historial-medico')
  @ApiOperation({ summary: 'Historial médico de una mascota' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({
    status: 200,
    description: 'Historial encontrado',
    type: HistorialMedicoDto
  })
  @ApiResponse({ status: 404, description: 'Historial no encontrado para la mascota' })
  async findHistorialMedicoByMascota(@Param('id') id: string) {
    const historial = await this.veterinariaService.findHistorialPorMascota(id);
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
    type: HistorialMedicoDto
  })
  @ApiResponse({ status: 404, description: 'Historial no encontrado' })
  async findHistorialMedicoById(@Param('id') id: string) {
    return this.veterinariaService.findHistorialMedicoById(id);
  }

  @ApiTags('Historial Médico')
  @Put('historial-medico/:id')
  @ApiOperation({ summary: 'Actualiza un historial médico existente' })
  @ApiParam({ name: 'id', description: 'ID del historial médico a actualizar' })
  @ApiBody({ type: UpdateHistorialMedicoDto })
  @ApiResponse({
    status: 200,
    description: 'Historial médico actualizado',
    type: HistorialMedicoDto
  })
  async updateHistorialMedico(
    @Param('id') id: string,
    @Body() dto: UpdateHistorialMedicoDto,
  ) {
    return this.veterinariaService.updateHistorialMedico(id, dto);
  }

  @ApiTags('Historial Médico')
  @Delete('historial-medico/:id')
  @ApiOperation({ summary: 'Elimina un historial médico por ID' })
  @ApiParam({ name: 'id', description: 'ID del historial médico a eliminar' })
  @ApiResponse({ status: 200, description: 'Historial médico eliminado' })
  async deleteHistorialMedico(@Param('id') id: string) {
    return this.veterinariaService.deleteHistorialMedico(id);
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
    return this.veterinariaService.deleteMultipleHistorialMedico(ids);
  }

  @ApiTags('Historial Médico')
  @Put('historial-medico/:historialId/entrada/:entradaId')
  @ApiOperation({ summary: 'Actualiza una entrada específica del historial médico' })
  @ApiParam({ name: 'historialId', description: 'ID del historial médico que contiene la entrada' })
  @ApiParam({ name: 'entradaId',    description: 'ID de la entrada a modificar' })
  @ApiBody({ type: AddEntradaHistorialDto })
  @ApiResponse({
    status: 200,
    description: 'Entrada actualizada con éxito',
    type: HistorialMedicoDto
  })
  @ApiResponse({ status: 404, description: 'Historial o entrada no encontrado' })
  async updateEntrada(
    @Param('historialId') historialId: string,
    @Param('entradaId')    entradaId: string,
    @Body()               entradaDto: AddEntradaHistorialDto,
  ): Promise<HistorialMedico> {
    return this.veterinariaService.updateEntrada(historialId, entradaId, entradaDto);
  }



    @ApiTags('Historial Médico')
    @Delete('historial-medico/:historialId/entrada/:entradaId')
    @ApiOperation({ summary: 'Elimina una entrada específica del historial médico' })
    @ApiParam({ name: 'historialId', description: 'ID del historial médico que contiene la entrada' })
    @ApiParam({ name: 'entradaId',    description: 'ID de la entrada a eliminar' })
    @ApiResponse({
      status: 200,
      description: 'Entrada eliminada con éxito',
      type: HistorialMedicoDto  // <-- aquí
    })
    async deleteEntrada(
      @Param('historialId') historialId: string,
      @Param('entradaId')    entradaId: string
    ): Promise<HistorialMedico> {    // <-- y aquí
      return this.veterinariaService.deleteEntrada(historialId, entradaId);
    }



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
      return this.veterinariaService.findServicioByNombre(search);
    } else {
      return this.veterinariaService.findAllServiciosPrestados();
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
    return this.veterinariaService.createServicioPrestado(createServicioPrestadoDto);
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
    return this.veterinariaService.findAllServiciosPrestados();
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
    return this.veterinariaService.findServicioPrestadoById(id);
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
    return this.veterinariaService.updateServicioPrestado(id, updateServicioPrestadoDto);
  }

  @ApiTags('Servicios Prestados')
  @Delete('servicio-prestado/:id')
  @ApiOperation({ summary: 'Elimina un servicio prestado por su ID' })
  @ApiParam({ name: 'id', description: 'ID del servicio prestado' })
  @ApiResponse({ status: 200, description: 'Servicio prestado eliminado' })
  async deleteServicioPrestado(@Param('id') id: string): Promise<ServicioPrestado> {
    return this.veterinariaService.deleteServicioPrestado(id);
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
    await this.veterinariaService.deleteMultipleServiciosPrestados(ids);
    return;
  }

  //  Rutas para Veterinario

  @ApiTags('Veterinarios')
  @Get('veterinario')
  @ApiOperation({ summary: 'Obtiene todos los veterinarios o filtra por nombre/apellido' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Término para búsqueda de veterinarios'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de veterinarios',
    type: [VeterinarioDto]
  })
  async findVeterinarios(
    @Query('search') search?: string
  ): Promise<Veterinario[]> {
    if (search && search.trim() !== '') {
      return this.veterinariaService.findVeterinarioByNombre(search);
    } else {
      return this.veterinariaService.findAllVeterinarios();
    }
  }

  @ApiTags('Veterinarios')
  @Post('veterinario')
  @ApiOperation({ summary: 'Crea un nuevo veterinario' })
  @ApiBody({ type: CreateVeterinarioDto })
  @ApiResponse({
    status: 201,
    description: 'Veterinario creado',
    type: VeterinarioDto
  })
  async createVeterinario(
    @Body() createVeterinarioDto: CreateVeterinarioDto
  ): Promise<Veterinario> {
    return this.veterinariaService.createVeterinario(createVeterinarioDto);
  }

  @ApiTags('Veterinarios')
  @Get('veterinario/:id')
  @ApiOperation({ summary: 'Obtiene un veterinario por su ID' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiResponse({
    status: 200,
    description: 'Veterinario encontrado',
    type: VeterinarioDto
  })
  @ApiResponse({ status: 404, description: 'Veterinario no encontrado' })
  async findVeterinarioById(
    @Param('id') id: string
  ): Promise<Veterinario> {
    return this.veterinariaService.findVeterinarioById(id);
  }

  @ApiTags('Veterinarios')
  @Put('veterinario/:id')
  @ApiOperation({ summary: 'Actualiza un veterinario por su ID' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiBody({ type: UpdateVeterinarioDto })
  @ApiResponse({
    status: 200,
    description: 'Veterinario actualizado',
    type: VeterinarioDto
  })
  async updateVeterinario(
    @Param('id') id: string,
    @Body() updateVeterinarioDto: UpdateVeterinarioDto
  ): Promise<Veterinario> {
    return this.veterinariaService.updateVeterinario(id, updateVeterinarioDto);
  }

  @ApiTags('Veterinarios')
  @Delete('veterinario/:id')
  @ApiOperation({ summary: 'Elimina un veterinario por su ID' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Veterinario eliminado' })
  async deleteVeterinario(
    @Param('id') id: string
  ): Promise<Veterinario> {
    return this.veterinariaService.deleteVeterinario(id);
  }

  @ApiTags('Veterinarios')
  @Delete('veterinario')
  @ApiOperation({ summary: 'Elimina múltiples veterinarios' })
  @ApiBody({
    description: 'Array de IDs de veterinarios a eliminar',
    type: [String]
  })
  @ApiResponse({ status: 200, description: 'Veterinarios eliminados' })
  async deleteMultipleVeterinarios(
    @Body() ids: string[]
  ): Promise<Veterinario[]> {
    if (!ids || ids.length === 0) {
      throw new Error('No veterinario IDs provided for deletion.');
    }
    return this.veterinariaService.deleteMultipleVeterinarios(ids);
  }

}
