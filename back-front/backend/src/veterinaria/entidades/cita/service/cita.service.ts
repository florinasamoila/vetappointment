import { Get, Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppGateway } from 'src/app.gateway';

import { Cliente } from '../../cliente/interfaces/cliente/cliente.interface';
import { HistorialMedico } from '../../historial-medico/interfaces/historial-medico/historial-medico.interface';
import { Mascota } from '../../mascota/interfaces/mascota/mascota.interface';
import { ServicioPrestado } from '../../servicio-prestado/interfaces/servicio-prestado/servicio-prestado.interface';
import { Veterinario } from '../../veterinario/interfaces/veterinario/veterinario.interface';
import { Cita } from '../interfaces/cita/cita.interface';
import { CreateCitaDto } from '../dto/cita.dto/create-cita.dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/cita.dto/update-cita.dto/update-cita.dto';




// Removed duplicate import of NotFoundException

@Injectable()
export class CitaService {
  citaService: any;
    constructor(
        @InjectModel('Cliente') private clienteModel: Model<Cliente>,
        @InjectModel('Mascota') private mascotaModel: Model<Mascota>,
        @InjectModel('Cita') private citaModel: Model<Cita>,

        @InjectModel('HistorialMedico') private historialMedicoModel: Model<HistorialMedico>,
        @InjectModel('ServicioPrestado') private servicioPrestadoModel: Model<ServicioPrestado>,
        @InjectModel('Veterinario') private veterinarioModel: Model<Veterinario>,
        private readonly gateway: AppGateway 
    ) {}

    //-- CITAS - CRUD ---------------------------------------------------------------------------------------------------------------
      // 1. Buscar citas por término
      async findCitasByCampo(search: string): Promise<Cita[]> {
        const filtro = search.toLowerCase();
        const citas = await this.citaModel
          .find()
          .populate('cliente')
          .populate('mascota')
          .populate('veterinario')
          .populate('servicioPrestado')
          .exec();
    
        const resultado = citas.filter(cita => {
          const cl = (cita.cliente as any);
          const ms = (cita.mascota as any);
          return (
            cl?.nombre?.toLowerCase().includes(filtro) ||
            cl?.apellido?.toLowerCase().includes(filtro) ||
            ms?.nombre?.toLowerCase().includes(filtro) ||
            ms?._id?.toString().includes(filtro) ||
            cita.motivo?.toLowerCase().includes(filtro) ||
            cita.observaciones?.toLowerCase().includes(filtro)
          );
        });
    
        this.gateway.server.emit('citasSearch', resultado);
        return resultado;
      }
    
      // 2. Crear cita y añadir al historial
      async createCita(createCitaDto: CreateCitaDto): Promise<Cita> {
        const nuevaCita = new this.citaModel(createCitaDto);
        const citaGuardada = await nuevaCita.save();
    
        const entrada = {
          cita: citaGuardada._id,
          veterinario: createCitaDto.veterinario,
          fecha: new Date(createCitaDto.fechaHora),
          diagnosticos: '',
          tratamientos: '',
          observaciones: createCitaDto.observaciones || ''
        };
    
        let historial = await this.historialMedicoModel.findOne({ mascotaID: createCitaDto.mascota });
        if (historial) {
          historial.entradas.push(entrada);
          await historial.save();
        } else {
          historial = await this.historialMedicoModel.create({
            mascotaID: createCitaDto.mascota,
            entradas: [entrada]
          });
        }
    
        this.gateway.server.emit('citaCreated', citaGuardada);
        return citaGuardada;
      }
    
      // 3. Listar todas las citas
      async findAllCitas(): Promise<Cita[]> {
        const todas = await this.citaModel
          .find()
          .populate('mascota')
          .populate('cliente')
          .populate('veterinario')
          .populate('servicioPrestado')
          .exec();
        this.gateway.server.emit('citasList', todas);
        return todas;
      }
    
      // 4. Obtener cita por ID
      async findCitaById(id: string): Promise<Cita> {
        const cita = await this.citaModel.findById(id).exec();
        if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
        this.gateway.server.emit('citaDetail', cita);
        return cita;
      }
    
      // 5. Actualizar cita
      async updateCita(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
        const updated = await this.citaModel.findByIdAndUpdate(id, updateCitaDto, { new: true });
        if (!updated) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
        this.gateway.server.emit('citaUpdated', updated);
        return updated;
      }
    
      // 6. Eliminar cita
      async deleteCita(id: string): Promise<Cita> {
        const deleted = await this.citaModel.findByIdAndDelete(id).exec();
        if (!deleted) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
        this.gateway.server.emit('citaDeleted', deleted);
        return deleted;
      }
    
      // 7. Eliminar múltiples citas
      async deleteMultipleCitas(ids: string[]): Promise<Cita[]> {
        const toDelete = await this.citaModel.find({ _id: { $in: ids } }).exec();
        if (!toDelete.length) throw new NotFoundException('No citas found to delete.');
        await this.citaModel.deleteMany({ _id: { $in: ids } }).exec();
        this.gateway.server.emit('citasDeleted', toDelete);
        return toDelete;
      }
    
      // 8. Listar citas de una mascota
      async findCitasByMascotaId(mascotaId: string): Promise<Cita[]> {
        const citas = await this.citaModel.find({ mascota: mascotaId }).exec();
        this.gateway.server.emit('citasByMascota', { mascotaId, citas });
        return citas;
      }
    
      // 9. Listar citas de un veterinario en fecha
      async findCitasPorVeterinarioYFecha(veterinarioId: string, fecha: string): Promise<Cita[]> {
        const dia = new Date(fecha);
        const inicio = new Date(dia.setHours(0, 0, 0, 0));
        const fin = new Date(dia.setHours(23, 59, 59, 999));
        const citas = await this.citaModel.find({
          veterinario: veterinarioId,
          fechaHora: { $gte: inicio, $lte: fin },
        }).exec();
        this.gateway.server.emit('citasByVeterinario', { veterinarioId, fecha, citas });
        return citas;
      }
    

}