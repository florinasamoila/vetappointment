import { Get, Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppGateway } from 'src/app.gateway';

import { Cita } from '../../cita/interfaces/cita/cita.interface';
import { HistorialMedico } from '../../historial-medico/interfaces/historial-medico/historial-medico.interface';
import { Mascota } from '../../mascota/interfaces/mascota/mascota.interface';
import { ServicioPrestado } from '../../servicio-prestado/interfaces/servicio-prestado/servicio-prestado.interface';
import { Veterinario } from '../../veterinario/interfaces/veterinario/veterinario.interface';

import { Cliente } from '../../cliente/interfaces/cliente/cliente.interface';
import { CreateMascotaDto } from '../dto/create-mascota.dto/create-mascota.dto';
import { UpdateMascotaDto } from '../dto/update-mascota.dto/update-mascota.dto';
import { ClienteDto } from '../../cliente/dto/cliente.dto/cliente.dto';
// Removed duplicate import of NotFoundException

@Injectable()
export class MascotaService {
  mascotaService: any;
  constructor(
    @InjectModel('Cliente') private clienteModel: Model<Cliente>,
    @InjectModel('Mascota') private mascotaModel: Model<Mascota>,
    @InjectModel('Cita') private citaModel: Model<Cita>,

    @InjectModel('HistorialMedico') private historialMedicoModel: Model<HistorialMedico>,
    @InjectModel('ServicioPrestado') private servicioPrestadoModel: Model<ServicioPrestado>,
    @InjectModel('Veterinario') private veterinarioModel: Model<Veterinario>,
    private readonly gateway: AppGateway,
  ) {}

  //-- MASCOTAS - CRUD ---------------------------------------------------------------------------------------------------------------
  // 1. Busca mascotas por nombre, especie o raza
  async findMascotaByNombre(nombre: string): Promise<Mascota[]> {
    if (!nombre?.trim()) {
      this.gateway.server.emit('mascotasSearch', []);
      return [];
    }
    const mascotas = await this.buscarPorCampo(
      this.mascotaModel,
      ['nombre', 'especie', 'raza'],
      nombre,
    );
    this.gateway.server.emit('mascotasSearch', mascotas);
    return mascotas;
  }

  // 2. Lista mascotas de un cliente
  async findMascotasByClienteId(clienteId: string): Promise<Mascota[]> {
    const cliente = await this.clienteModel.findById(clienteId).exec();
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    const mascotas = await this.mascotaModel.find({ _id: { $in: cliente.mascotas } }).exec();
    this.gateway.server.emit('mascotasByCliente', { clienteId, mascotas });
    return mascotas;
  }

  // 3. Crea una mascota y su historial
  async createMascota(createMascotaDto: CreateMascotaDto): Promise<Mascota> {
    const nuevaMascota = new this.mascotaModel(createMascotaDto);
    const mascotaGuardada = await nuevaMascota.save();
    const historial = new this.historialMedicoModel({
      mascotaID: mascotaGuardada._id,
      entradas: [],
    });
    const historialGuardado = await historial.save();
    await this.mascotaModel.findByIdAndUpdate(mascotaGuardada._id, {
      $set: { historialMedico: historialGuardado._id },
    });

    if (mascotaGuardada.cliente) {
      await this.clienteModel.findByIdAndUpdate(mascotaGuardada.cliente, {
        $push: { mascotas: mascotaGuardada._id },
      });
    }

    this.gateway.server.emit('mascotaCreated', mascotaGuardada);
    return mascotaGuardada;
  }

  // 4. Lista todas las mascotas
  async findAllMascotas(): Promise<Mascota[]> {
    const todas = await this.mascotaModel.find().exec();
    this.gateway.server.emit('mascotasList', todas);
    return todas;
  }

  // 5. Obtiene una mascota por ID
  async findMascotaById(id: string): Promise<Mascota> {
    const mascota = await this.mascotaModel.findById(id).exec();
    if (!mascota) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    this.gateway.server.emit('mascotaDetail', mascota);
    return mascota;
  }

  // 6. Actualiza una mascota
  async updateMascota(id: string, dto: UpdateMascotaDto): Promise<Mascota> {
    const updated = await this.mascotaModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    this.gateway.server.emit('mascotaUpdated', updated);
    return updated;
  }

  // 7. Elimina una mascota
  async deleteMascota(id: string): Promise<Mascota> {
    const deleted = await this.mascotaModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    this.gateway.server.emit('mascotaDeleted', deleted);
    return deleted;
  }

  // 8. Elimina múltiples mascotas
  async deleteMultipleMascotas(ids: string[]): Promise<Mascota[]> {
    const toDelete = await this.mascotaModel.find({ _id: { $in: ids } }).exec();
    if (!toDelete.length) throw new NotFoundException('No mascotas found to delete.');
    await this.mascotaModel.deleteMany({ _id: { $in: ids } }).exec();
    this.gateway.server.emit('mascotasDeleted', toDelete);
    return toDelete;
  }

  // 4. Obtiene un cliente por ID junto con sus mascotas
  async findClienteById(id: string): Promise<ClienteDto> {
    const cliente = await this.clienteModel.findById(id).populate('mascotas').exec();

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    const dto: ClienteDto = {
      _id: cliente._id.toString(),
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      mascotas: cliente.mascotas.map((m: any) => ({
        _id: m._id.toString(),
        nombre: m.nombre,
        especie: m.especie,
        raza: m.raza,
        edad: m.edad,
        sexo: m.sexo,
        color: m.color,
        peso: m.peso,
        observaciones: m.observaciones,
        cliente: m.cliente.toString(),
      })),
    };

    this.gateway.server.emit('clienteDetail', dto);
    return dto;
  }

  // 9. Agrega mascota a cliente (o crea cliente)
  async agregarMascotaACliente(clienteId: string, mascotaData: CreateMascotaDto): Promise<Cliente> {
    let cliente = await this.clienteModel.findById(clienteId);
    if (!cliente) {
      cliente = await this.clienteModel.create({
        nombre: mascotaData.nombre,
        apellido: 'default',
        email: 'default@email.com',
        telefono: '00000000',
        direccion: 'default address',
        mascotas: [],
      });
    }

    const nuevaMascota = new this.mascotaModel({ ...mascotaData, cliente: cliente._id });
    const mascotaGuardada = await nuevaMascota.save();
    cliente.mascotas.push(mascotaGuardada._id);
    await cliente.save();

    const historial = new this.historialMedicoModel({
      mascotaID: mascotaGuardada._id,
      entradas: [],
    });
    await historial.save();
    mascotaGuardada.historialMedico = historial as any;
    await mascotaGuardada.save();

    const clienteDto = await this.findClienteById(cliente._id.toString());
    this.gateway.server.emit('mascotaAddedToCliente', {
      clienteId: cliente._id,
      mascota: mascotaGuardada,
    });
    return clienteDto as any;
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
