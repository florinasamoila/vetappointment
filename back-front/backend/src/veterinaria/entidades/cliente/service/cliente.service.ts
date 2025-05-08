import { Get, Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppGateway } from 'src/app.gateway';
import { Cliente } from '../interfaces/cliente/cliente.interface';

import { Cita } from '../../cita/interfaces/cita/cita.interface';
import { HistorialMedico } from '../../historial-medico/interfaces/historial-medico/historial-medico.interface';
import { Mascota } from '../../mascota/interfaces/mascota/mascota.interface';
import { ServicioPrestado } from '../../servicio-prestado/interfaces/servicio-prestado/servicio-prestado.interface';
import { Veterinario } from '../../veterinario/interfaces/veterinario/veterinario.interface';
import { ClienteDto } from '../dto/cliente.dto/cliente.dto';
import { CreateClienteDto } from '../dto/create-cliente.dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto/update-cliente.dto';
// Removed duplicate import of NotFoundException

@Injectable()
export class ClienteService {
  clienteService: any;
    constructor(
        @InjectModel('Cliente') private clienteModel: Model<Cliente>,
        @InjectModel('Mascota') private mascotaModel: Model<Mascota>,
        @InjectModel('Cita') private citaModel: Model<Cita>,

        @InjectModel('HistorialMedico') private historialMedicoModel: Model<HistorialMedico>,
        @InjectModel('ServicioPrestado') private servicioPrestadoModel: Model<ServicioPrestado>,
        @InjectModel('Veterinario') private veterinarioModel: Model<Veterinario>,
        private readonly gateway: AppGateway 
    ) {}



  //-- CLIENTES - CRUD---------------------------------------------------------------------------------------------------------------
  //-- 1. Crear cliente con mascotas ------------------------------------------------------------------------------------------------
  async createCliente(createClienteDto: CreateClienteDto): Promise<ClienteDto> {
    // 1) Buscar si ya existe un cliente con ese email
    let clienteExistente = await this.clienteModel.findOne({
      email: createClienteDto.email,
    });

    if (clienteExistente) {
      // 2) Si existe y vienen mascotas nuevas, crearlas y asociarlas
      if (createClienteDto.mascotas?.length) {
        const nuevasMascotas: ObjectId[] = [];
        for (const mascotaDto of createClienteDto.mascotas) {
          const mascotaExistente = await this.mascotaModel.findOne({
            nombre: mascotaDto.nombre,
            cliente: clienteExistente._id,
          });
          if (!mascotaExistente) {
            const nuevaMascota = await this.mascotaModel.create({
              ...mascotaDto,
              cliente: clienteExistente._id,
            });
            // Crear historial vacío para la nueva mascota
            const historialMedico = new this.historialMedicoModel({
              mascotaID: nuevaMascota._id,
              entradas: [],
            });
            await historialMedico.save();
            // Guardar referencia en la mascota
            nuevaMascota.historialMedico = historialMedico as any;
            await nuevaMascota.save();
            nuevasMascotas.push(nuevaMascota._id as unknown as ObjectId);
          }
        }
        if (nuevasMascotas.length) {
          clienteExistente.mascotas.push(
            ...nuevasMascotas.map(id => id.toString())
          );
          await clienteExistente.save();
        }
      }
      // 3) Obtener DTO actualizado y emitir evento
      const dto = await this.findClienteById(clienteExistente._id);
      this.gateway.server.emit('clienteCreated', dto);
      return dto;
    }

    // 4) Si no existía, crear cliente nuevo
    const cliente = await this.clienteModel.create({
      ...createClienteDto,
      mascotas: [],
    });

    // 5) Si incluyó mascotas, crearlas junto a su historial
    if (createClienteDto.mascotas?.length) {
      const nuevasMascotas: ObjectId[] = [];
      for (const mascotaDto of createClienteDto.mascotas) {
        const mascota = await this.mascotaModel.create({
          ...mascotaDto,
          cliente: cliente._id,
        });
        nuevasMascotas.push(mascota._id as unknown as ObjectId);

        const historialMedico = new this.historialMedicoModel({
          mascotaID: mascota._id,
          entradas: [],
        });
        await historialMedico.save();
      }
      cliente.mascotas.push(...nuevasMascotas.map(id => id.toString()));
      await cliente.save();
    }

    // 6) Construir DTO final y emitir evento
    const dto = await this.findClienteById(cliente._id);
    this.gateway.server.emit('clienteCreated', dto);
    return dto;
  }



// 2. Encuentra a todos los clientes
async findAllClientes(): Promise<Cliente[]> {
  const clientes = await this.clienteModel.find().exec();
  this.gateway.server.emit('clientesList', clientes);
  return clientes;
}

// 3. Busca clientes por nombre, apellido, email o teléfono
async findClientByName(search: string): Promise<Cliente[]> {
  if (!search?.trim()) {
    this.gateway.server.emit('clientesSearch', []);
    return [];
  }
  const clientes = await this.clienteModel.find({
    $or: [
      { nombre:   { $regex: search, $options: 'i' } },
      { apellido:{ $regex: search, $options: 'i' } },
      { email:   { $regex: search, $options: 'i' } },
      { telefono:{ $regex: search, $options: 'i' } },
    ]
  }).exec();
  this.gateway.server.emit('clientesSearch', clientes);
  return clientes;
}

// 4. Obtiene un cliente por ID junto con sus mascotas
async findClienteById(id: string): Promise<ClienteDto> {
  const cliente = await this.clienteModel
    .findById(id)
    .populate('mascotas')
    .exec();

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

// 5. Actualiza un cliente por ID
async updateCliente(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
  const clienteActualizado = await this.clienteModel.findByIdAndUpdate(id, updateClienteDto, { new: true });
  if (!clienteActualizado) {
    throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
  }
  this.gateway.server.emit('clienteUpdated', clienteActualizado);
  return clienteActualizado;
}

// 6. Elimina un cliente por ID
async deleteCliente(id: string): Promise<Cliente> {
  const clienteEliminado = await this.clienteModel.findByIdAndDelete(id).exec();
  if (!clienteEliminado) {
    throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
  }
  this.gateway.server.emit('clienteDeleted', clienteEliminado);
  return clienteEliminado;
}

// 7. Elimina múltiples clientes en cascada
async deleteMultipleClientes(ids: string[]): Promise<Cliente[]> {
  const clientesToDelete = await this.clienteModel.find({ _id: { $in: ids } }).exec();
  if (!clientesToDelete.length) {
    throw new NotFoundException('No se encontraron clientes para eliminar.');
  }
  const mascotas = await this.mascotaModel.find({ cliente: { $in: ids } }).exec();
  const mascotaIds = mascotas.map(m => m._id);
  await this.citaModel.deleteMany({
    $or: [
      { cliente: { $in: ids } },
      { mascota: { $in: mascotaIds } }
    ]
  }).exec();
  await this.historialMedicoModel.deleteMany({ mascotaID: { $in: mascotaIds } }).exec();
  await this.mascotaModel.deleteMany({ cliente: { $in: ids } }).exec();
  await this.clienteModel.deleteMany({ _id: { $in: ids } }).exec();

  this.gateway.server.emit('clientesDeleted', clientesToDelete);
  return clientesToDelete;
}
}