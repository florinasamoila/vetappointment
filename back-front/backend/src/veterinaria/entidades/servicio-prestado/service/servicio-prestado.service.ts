import { Get, Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppGateway } from 'src/app.gateway';

import { ClienteDto } from '../../cliente/dto/cliente.dto/cliente.dto';

import { Cita } from '../../cita/interfaces/cita/cita.interface';
import { Cliente } from '../../cliente/interfaces/cliente/cliente.interface';
import { HistorialMedico } from '../../historial-medico/interfaces/historial-medico/historial-medico.interface';
import { Mascota } from '../../mascota/interfaces/mascota/mascota.interface';
import { Veterinario } from '../../veterinario/interfaces/veterinario/veterinario.interface';
import { ServicioPrestado } from '../interfaces/servicio-prestado/servicio-prestado.interface';
import { CreateServicioPrestadoDto } from '../dto/create-servicio-prestado.dto/create-servicio-prestado.dto';
import { UpdateServicioPrestadoDto } from '../dto/update-servicio-prestado.dto/update-servicio-prestado.dto';
// Removed duplicate import of NotFoundException

@Injectable()
export class ServicioPrestadoService {
  servicioPrestadoService: any;
  constructor(
    @InjectModel('Cliente') private clienteModel: Model<Cliente>,
    @InjectModel('Mascota') private mascotaModel: Model<Mascota>,
    @InjectModel('Cita') private citaModel: Model<Cita>,

    @InjectModel('HistorialMedico') private historialMedicoModel: Model<HistorialMedico>,
    @InjectModel('ServicioPrestado') private servicioPrestadoModel: Model<ServicioPrestado>,
    @InjectModel('Veterinario') private veterinarioModel: Model<Veterinario>,
    private readonly gateway: AppGateway,
  ) {}

  //-- SERVICIOS PRESTADOS - CRUD ---------------------------------------------------------------------------------------------------
  //-- 1. Encuentra servicios prestados por nombre o descripción ---------------------------------------------------------------------
  async createServicioPrestado(
    createServicioPrestadoDto: CreateServicioPrestadoDto,
  ): Promise<ServicioPrestado> {
    const nuevoServicio = new this.servicioPrestadoModel(createServicioPrestadoDto);
    return nuevoServicio.save();
  }

  //-- 2. Encuentra todos los servicios prestados -----------------------------------------------------------------------------------
  async findAllServiciosPrestados(): Promise<ServicioPrestado[]> {
    return this.servicioPrestadoModel.find().exec();
  }

  //-- 3. Encuentra un servicio prestado por ID ----------------------------------------------------------------------------------
  async findServicioPrestadoById(id: string): Promise<ServicioPrestado> {
    const servicio = await this.servicioPrestadoModel.findById(id).exec();
    if (!servicio) throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicio;
  }

  //-- 4. Actualiza un servicio prestado por ID ----------------------------------------------------------------------------------
  async updateServicioPrestado(
    id: string,
    updateServicioPrestadoDto: UpdateServicioPrestadoDto,
  ): Promise<ServicioPrestado> {
    const servicioActualizado = await this.servicioPrestadoModel.findByIdAndUpdate(
      id,
      updateServicioPrestadoDto,
      { new: true },
    );
    if (!servicioActualizado)
      throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicioActualizado;
  }

  //-- 5. Elimina un servicio prestado por ID -----------------------------------------------------------------------------------
  async deleteServicioPrestado(id: string): Promise<ServicioPrestado> {
    const servicioEliminado = await this.servicioPrestadoModel.findByIdAndDelete(id).exec();
    if (!servicioEliminado)
      throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicioEliminado;
  }

  //-- 6. Elimina varios servicios prestados seleccionados ------------------------------------------------------------------------
  async deleteMultipleServiciosPrestados(ids: string[]): Promise<ServicioPrestado[]> {
    const serviciosAEliminar = await this.servicioPrestadoModel.find({ _id: { $in: ids } }).exec();

    if (serviciosAEliminar.length === 0) {
      throw new NotFoundException('No servicios prestados found to delete.');
    }

    const result = await this.servicioPrestadoModel.deleteMany({ _id: { $in: ids } }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No servicios prestados found to delete.');
    }

    return serviciosAEliminar;
  }

  //-- 7. Encuentra servicios prestados por nombre o descripción ---------------------------------------------------------------------
  async findServicioByNombre(nombre: string): Promise<ServicioPrestado[]> {
    return this.buscarPorCampo(this.servicioPrestadoModel, ['nombre', 'descripcion'], nombre);
  }

  private async buscarPorCampo(
    model: Model<any>,
    campos: string[],
    search: string,
  ): Promise<any[]> {
    if (!search || typeof search !== 'string') {
      return [];
    }

    const orConditions = campos.map((campo) => ({
      [campo]: { $regex: search, $options: 'i' },
    }));

    return model.find({ $or: orConditions }).exec();
  }
}
