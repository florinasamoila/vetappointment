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

import { CreateHistorialMedicoDto } from '../dto/create-historial-medico.dto/create-historial-medico.dto';
import { AddEntradaHistorialDto } from '../dto/historial-medico.dto/add-entrada-historial.dto';
import { UpdateHistorialMedicoDto } from '../dto/update-historial-medico.dto/update-historial-medico.dto';
import { Cliente } from '../../cliente/interfaces/cliente/cliente.interface';
// Removed duplicate import of NotFoundException

@Injectable()
export class HistorialMedicoService {
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



 //-- HISTORIAL MÉDICO / ENTRADAS AL HISTORIAL  - CRUD ---------------------------------------------------------------------------------------------------------------
   //-- 1. Agrega una entrada al historial médico de una mascota ----------------------------------------------------------------------------------
   async agregarEntradaAHistorial(mascotaId: string, entrada: any) {
     const tieneCitas = await this.verificarCitasAntesDeAgregarEntrada(mascotaId);
 
     if (!tieneCitas) {
       throw new NotFoundException(`La mascota con ID ${mascotaId} no tiene citas registradas. No se puede agregar una entrada al historial médico.`);
     }
 
     const historial = await this.historialMedicoModel.findOne({ mascotaID: mascotaId });
 
     if (!historial) {
       throw new NotFoundException(`No se encontró historial médico para la mascota con ID ${mascotaId}`);
     }
 
     historial.entradas.push(entrada);
     return await historial.save();
   }
 
   //-- 2. Verifica si la mascota tiene citas antes de agregar una entrada al historial médico --------------------------------
   async verificarCitasAntesDeAgregarEntrada(mascotaId: string): Promise<boolean> {
     const citas = await this.citaModel.find({ mascota: mascotaId });
     return citas.length > 0;  
   }
 
   //-- 3. Crea o actualiza el historial médico de una mascota -------------------------------------------------------------------
   async crearOActualizarHistorial(mascotaID: string, entrada: AddEntradaHistorialDto) {
     const historial = await this.historialMedicoModel.findOne({ mascotaID });
 
     if (historial) {
       historial.entradas.push(entrada);
       return historial.save();
     }
 
     return this.historialMedicoModel.create({
       mascotaID,
       entradas: [entrada]
     });
   }
 
   //-- 4. Encuentra el historial médico de una mascota por descripción ----------------------------------------------------------------
   async findHistorialByDescripcion(texto: string): Promise<HistorialMedico[]> {
     
     const mascotasCoincidentes = await this.mascotaModel.find({
       nombre: { $regex: texto, $options: 'i' }
     }).select('_id').exec();
 
     const idsMascotas = mascotasCoincidentes.map(m => m._id);
 
     return this.historialMedicoModel.find({
       mascotaID: { $in: idsMascotas }
     })
     .populate('mascotaID')  
     .exec();
   }
 
   //-- 5. Crea un historial médico ----------------------------------------------------------------------------------------------
   async createHistorialMedico(createHistorialMedicoDto: CreateHistorialMedicoDto): Promise<HistorialMedico> {
     const nuevoHistorial = new this.historialMedicoModel(createHistorialMedicoDto);
     return nuevoHistorial.save();
   }
 
   //-- 6. Encuentra todos los historiales médicos ----------------------------------------------------------------------------------
   async findAllHistorialesMedicos(): Promise<any[]> {
     return this.historialMedicoModel
       .find({})
       .populate('mascotaID', 'nombre')    
       .exec();
   }
 
   //-- 7. Encuentra un historial médico por ID -------------------------------------------------------------------------------------
   async findHistorialMedicoById(id: string): Promise<any> {
     const historial = await this.historialMedicoModel
       .findById(id)
       .lean()  
       
       .populate({
         path: 'mascotaID',
         model: 'Mascota',
         select: 'nombre especie raza edad sexo color peso',
         populate: {
           path: 'cliente',
           model: 'Cliente',
           select: 'nombre apellido email telefono direccion'
         }
       })
       
       .populate({
         path: 'entradas.cita',
         model: 'Cita',
         select: 'fechaHora motivo estado observaciones',
         populate: [
           { path: 'cliente', model: 'Cliente', select: 'nombre apellido' },
           { path: 'mascota', model: 'Mascota', select: 'nombre especie raza' },
           { path: 'veterinario', model: 'Veterinario', select: 'nombre apellido' },
           { path: 'servicioPrestado', model: 'ServicioPrestado', select: 'nombre' }
         ]
       })
       
       .populate({
         path: 'entradas.veterinario',
         model: 'Veterinario',
         select: 'nombre apellido'
       })
       .exec();
 
     if (!historial) {
       throw new NotFoundException(`Historial Médico con ID ${id} no encontrado`);
     }
 
     return historial;
   }
 
 
   //-- 8. Actualiza un historial médico por ID -------------------------------------------------------------------------------------
   async updateHistorialMedico(id: string, updateHistorialMedicoDto: UpdateHistorialMedicoDto): Promise<HistorialMedico> {
     const historialActualizado = await this.historialMedicoModel.findByIdAndUpdate(id, updateHistorialMedicoDto, { new: true });
     if (!historialActualizado) throw new NotFoundException(`Historial Médico con ID ${id} no encontrado`);
     return historialActualizado;
   }
 
   //-- 9. Elimina un historial médico por ID ---------------------------------------------------------------------------------------
   async deleteHistorialMedico(id: string): Promise<HistorialMedico> {
     const historialEliminado = await this.historialMedicoModel.findByIdAndDelete(id).exec();
     if (!historialEliminado) throw new NotFoundException(`Historial Médico con ID ${id} no encontrado`);
     return historialEliminado;
   }
 
   //-- 10. Elimina varios historiales médicos seleccionados ------------------------------------------------------------------------
   async deleteMultipleHistorialMedico(ids: string[]): Promise<HistorialMedico[]> {
     
     const historialesAEliminar = await this.historialMedicoModel
       .find({ _id: { $in: ids } })
       .exec();
 
     if (historialesAEliminar.length === 0) {
       throw new NotFoundException('No historial médicos found to delete.');
     }
 
     
     const result = await this.historialMedicoModel
       .deleteMany({ _id: { $in: ids } })
       .exec();
 
     if (result.deletedCount === 0) {
       throw new NotFoundException('No historial médicos found to delete.');
     }
 
     
     return historialesAEliminar;
   }
 
   //-- 11. Encuentra el historial médico de una mascota por ID de mascota ----------------------------------------------------------
   async findHistorialPorMascota(mascotaId: string): Promise<HistorialMedico> {
     const historial = await this.historialMedicoModel
       .findOne({ mascotaID: mascotaId })
       .populate('entradas.cita') 
       .populate('entradas.veterinario') 
       .exec();
 
     if (!historial) {
       throw new NotFoundException(`Historial médico no encontrado para la mascota con ID ${mascotaId}`);
     }
 
     return historial;
   }
 
 
 
   async updateEntrada(
     historialId: string,
     entradaId: string,
     dto: AddEntradaHistorialDto
   ): Promise<HistorialMedico> {
     // 1) Carga el historial
     const historial = await this.historialMedicoModel.findById(historialId);
     if (!historial) {
       throw new NotFoundException(`Historial ${historialId} no encontrado`);
     }
 
     // 2) Busca la entrada por su _id en el array
     const entrada = historial.entradas.find(e => e && e._id && e._id.toString() === entradaId);
     if (!entrada) {
       throw new NotFoundException(`Entrada ${entradaId} no encontrada`);
     }
 
     // 3) Actualiza los campos
     entrada.fecha         = dto.fecha;
     entrada.diagnosticos  = dto.diagnosticos;
     entrada.tratamientos  = dto.tratamientos;
     entrada.observaciones = dto.observaciones;
     entrada.veterinario   = dto.veterinario;
     entrada.cita          = dto.cita;
 
     // 4) Guarda el documento padre
     await historial.save();
     return historial;
   }
 
     /**
    * Elimina una entrada de un historial y devuelve el historial actualizado.
    */
     async deleteEntrada(
       historialId: string,
       entradaId: string
     ): Promise<HistorialMedico> {
       const historial = await this.historialMedicoModel.findById(historialId);
       if (!historial) {
         throw new NotFoundException(`Historial ${historialId} no encontrado`);
       }
   
       const idx = historial.entradas.findIndex(e => e?._id?.toString() === entradaId);
       if (idx === -1) {
         throw new NotFoundException(`Entrada ${entradaId} no encontrada`);
       }
   
       historial.entradas.splice(idx, 1);
       await historial.save();
       return historial;
     }
 
   
   
}