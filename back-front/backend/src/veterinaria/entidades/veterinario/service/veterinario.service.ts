import { Get, Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppGateway } from 'src/app.gateway';

import { Cita } from '../../cita/interfaces/cita/cita.interface';
import { Cliente } from '../../cliente/interfaces/cliente/cliente.interface';
import { HistorialMedico } from '../../historial-medico/interfaces/historial-medico/historial-medico.interface';
import { Mascota } from '../../mascota/interfaces/mascota/mascota.interface';
import { ServicioPrestado } from '../../servicio-prestado/interfaces/servicio-prestado/servicio-prestado.interface';
import { Veterinario } from '../interfaces/veterinario/veterinario.interface';
import { CreateVeterinarioDto } from '../dto/create-veterinario.dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from '../dto/update-veterinario.dto/update-veterinario.dto';



// Removed duplicate import of NotFoundException

@Injectable()
export class VeterinarioService {
  veterinarioService: any;
    constructor(
        @InjectModel('Cliente') private clienteModel: Model<Cliente>,
        @InjectModel('Mascota') private mascotaModel: Model<Mascota>,
        @InjectModel('Cita') private citaModel: Model<Cita>,

        @InjectModel('HistorialMedico') private historialMedicoModel: Model<HistorialMedico>,
        @InjectModel('ServicioPrestado') private servicioPrestadoModel: Model<ServicioPrestado>,
        @InjectModel('Veterinario') private veterinarioModel: Model<Veterinario>,
        private readonly gateway: AppGateway 
    ) {}

     //-- VETERINARIOS - CRUD ------------------------------------------------------------------------------------------------------------
      //-- 1. Encuentra veterinarios por nombre o apellido ------------------------------------------------------------------------------
      async findVeterinarioByNombre(nombre: string): Promise<Veterinario[]> {
        return this.buscarPorCampo(this.veterinarioModel, ['nombre', 'apellido'], nombre);
      }
    
      //-- 2. Crea un veterinario --------------------------------------------------------------------------------------------------------
      async createVeterinario(createVeterinarioDto: CreateVeterinarioDto): Promise<Veterinario> {
        const nuevoVeterinario = new this.veterinarioModel(createVeterinarioDto);
        return nuevoVeterinario.save();
      }
    
      //-- 3. Encuentra todos los veterinarios ----------------------------------------------------------------------------------------
      async findAllVeterinarios(): Promise<Veterinario[]> {
        return this.veterinarioModel.find().exec();
      }
    
      //-- 4. Encuentra un veterinario por ID ----------------------------------------------------------------------------------------
      async findVeterinarioById(id: string): Promise<Veterinario> {
        const veterinario = await this.veterinarioModel.findById(id).exec();
        if (!veterinario) throw new NotFoundException(`Veterinario con ID ${id} no encontrado`);
        return veterinario;
      }
    
      //-- 5. Actualiza un veterinario por ID -------------------------------------------------------------------------------------
      async updateVeterinario(id: string, updateVeterinarioDto: UpdateVeterinarioDto): Promise<Veterinario> {
        const veterinarioActualizado = await this.veterinarioModel.findByIdAndUpdate(id, updateVeterinarioDto, { new: true });
        if (!veterinarioActualizado) throw new NotFoundException(`Veterinario con ID ${id} no encontrado`);
        return veterinarioActualizado;
      }
    
      //-- 6. Elimina un veterinario por ID -------------------------------------------------------------------------------------
      async deleteVeterinario(id: string): Promise<Veterinario> {
        const veterinarioEliminado = await this.veterinarioModel.findByIdAndDelete(id).exec();
        if (!veterinarioEliminado) throw new NotFoundException(`Veterinario con ID ${id} no encontrado`);
        return veterinarioEliminado;
      }
    
      //-- 7. Elimina varios veterinarios seleccionados ------------------------------------------------------------------------
      async deleteMultipleVeterinarios(ids: string[]): Promise<Veterinario[]> {
        
        const veterinariosAEliminar = await this.veterinarioModel
          .find({ _id: { $in: ids } })
          .exec();
    
        if (veterinariosAEliminar.length === 0) {
          throw new NotFoundException('No veterinarios found to delete.');
        }
    
        
        const result = await this.veterinarioModel
          .deleteMany({ _id: { $in: ids } })
          .exec();
    
        if (result.deletedCount === 0) {
          throw new NotFoundException('No veterinarios found to delete.');
        }
    
        
        return veterinariosAEliminar;
      }
    
    
    
      private async buscarPorCampo(
        model: Model<any>,
        campos: string[],
        search: string
      ): Promise<any[]> {
        
        if (!search || typeof search !== 'string') {
          return [];
        }
      
        
        const orConditions = campos.map(campo => ({
          [campo]: { $regex: search, $options: 'i' },
        }));
      
        
        return model.find({ $or: orConditions }).exec();
      }
    }