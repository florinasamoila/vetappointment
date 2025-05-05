import { Get, Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cita } from './interfaces/cita/cita.interface';
import { Cliente } from './interfaces/cliente/cliente.interface';
import { Facturacion } from './interfaces/facturacion/facturacion.interface';
import { CreateClienteDto } from './dto-create/create-cliente.dto/create-cliente.dto';
import { UpdateClienteDto } from './dto-update/update-cliente.dto/update-cliente.dto';
import { CreateMascotaDto } from './dto-create/create-mascota.dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto-update/update-mascota.dto/update-mascota.dto';
import { HistorialMedico } from './interfaces/historial-medico/historial-medico.interface';
import { ServicioPrestado } from './interfaces/servicio-prestado/servicio-prestado.interface';
import { Veterinario } from './interfaces/veterinario/veterinario.interface';
import { CreateCitaDto } from './dto-create/create-cita.dto/create-cita.dto';
import { UpdateCitaDto } from './dto-update/update-cita.dto/update-cita.dto';
import { CreateFacturacionDto } from './dto-create/create-facturacion.dto/create-facturacion.dto';
import { UpdateFacturacionDto } from './dto-update/update-facturacion.dto/update-facturacion.dto';
import { CreateHistorialMedicoDto } from './dto-create/create-historial-medico.dto/create-historial-medico.dto';
import { UpdateHistorialMedicoDto } from './dto-update/update-historial-medico.dto/update-historial-medico.dto';
import { CreateServicioPrestadoDto } from './dto-create/create-servicio-prestado.dto/create-servicio-prestado.dto';
import { UpdateServicioPrestadoDto } from './dto-update/update-servicio-prestado.dto/update-servicio-prestado.dto';
import { CreateVeterinarioDto } from './dto-create/create-veterinario.dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from './dto-update/update-veterinario.dto/update-veterinario.dto';
import { ClienteDto } from './dto/cliente.dto/cliente.dto';
import { Mascota } from './interfaces/mascota/mascota.interface';
import { MascotaDto } from './dto/mascota.dto/mascota.dto'; 
import { AddEntradaHistorialDto } from './dto/historial-medico.dto/add-entrada-historial.dto';



@Injectable()
export class VeterinariaService {
  veterinariaService: any;
    constructor(
        @InjectModel('Cliente') private clienteModel: Model<Cliente>,
        @InjectModel('Mascota') private mascotaModel: Model<Mascota>,
        @InjectModel('Cita') private citaModel: Model<Cita>,
        @InjectModel('Facturacion') private facturacionModel: Model<Facturacion>,
        @InjectModel('HistorialMedico') private historialMedicoModel: Model<HistorialMedico>,
        @InjectModel('ServicioPrestado') private servicioPrestadoModel: Model<ServicioPrestado>,
        @InjectModel('Veterinario') private veterinarioModel: Model<Veterinario>,
    ) {}



  //-- CLIENTES - CRUD---------------------------------------------------------------------------------------------------------------
  //-- 1. Crear cliente con mascotas ------------------------------------------------------------------------------------------------
  async createCliente(createClienteDto: CreateClienteDto): Promise<ClienteDto> {
    
    let clienteExistente = await this.clienteModel.findOne({
      email: createClienteDto.email, 
    });

    if (clienteExistente) {
      
      if (createClienteDto.mascotas && createClienteDto.mascotas.length > 0) {
        
        const nuevasMascotas: ObjectId[] = [];
        for (const mascotaDto of createClienteDto.mascotas) {
          let mascotaExistente = await this.mascotaModel.findOne({
            nombre: mascotaDto.nombre,
            cliente: clienteExistente._id,
          });

          if (!mascotaExistente) {
            
            const nuevaMascota = await this.mascotaModel.create({
              ...mascotaDto,
              cliente: clienteExistente._id, 
            });

            const historialMedico = new this.historialMedicoModel({
              mascotaID: nuevaMascota._id,
              entradas: [],  
            });

            await historialMedico.save();
            nuevaMascota.historialMedico = historialMedico as unknown as HistorialMedico;
            await nuevaMascota.save();
            nuevasMascotas.push(nuevaMascota._id as unknown as ObjectId);
          }
        }
        if (nuevasMascotas.length > 0) {
          clienteExistente.mascotas.push(...nuevasMascotas.map(mascotaId => mascotaId.toString()));
          await clienteExistente.save();
        }
      }
      return this.findClienteById(clienteExistente._id); 
    }

    
    const cliente = await this.clienteModel.create({
      ...createClienteDto,
      mascotas: [], 
    });

    
    if (createClienteDto.mascotas && createClienteDto.mascotas.length > 0) {
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

      cliente.mascotas.push(...nuevasMascotas.map(mascotaId => mascotaId.toString()));
      await cliente.save();
    }

    return this.findClienteById(cliente._id);  
  }


  //-- 2. Encuentra a todos los clientes -------------------------------------------------------------------------------------------
  async findAllClientes(): Promise<Cliente[]> {
    return this.clienteModel.find().exec();
  }


  //-- 3. Encuentra a un por nombre, apellido, email o telefono --------------------------------------------------------------------
  async findClientByName(search: string): Promise<Cliente[]> {
    if (!search || !search.trim()) return [];
    return this.clienteModel.find({
      $or: [
        { nombre:   { $regex: search, $options: 'i' } },
        { apellido:{ $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
        { telefono:{ $regex: search, $options: 'i' } },
      ]
    }).exec();
  }

  //-- 4. Encuentra a un cliente por ID con sus mascotas ------------------------------------------------------------------------------
  async findClienteById(id: string): Promise<ClienteDto> {
    const cliente = await this.clienteModel
      .findById(id)
      .populate('mascotas')  
      .exec();
  
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  
    
    return {
      _id: cliente._id.toString(),
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      mascotas: cliente.mascotas.map((mascota: any) => ({
        _id: mascota._id.toString(),
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        edad: mascota.edad,
        sexo: mascota.sexo,
        color: mascota.color,
        peso: mascota.peso,
        observaciones: mascota.observaciones,
        cliente: mascota.cliente.toString(),  
      })),
    };
  }


  //-- 5. Actualiza un cliente por ID ------------------------------------------------------------------------------------------------
  async updateCliente(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const clienteActualizado = await this.clienteModel.findByIdAndUpdate(id, updateClienteDto, { new: true });
    if (!clienteActualizado) throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    return clienteActualizado;
  }

  //-- 6. Elimina un cliente por ID --------------------------------------------------------------------------------------------------
  async deleteCliente(id: string): Promise<Cliente> {
    const clienteEliminado = await this.clienteModel.findByIdAndDelete(id).exec();
    if (!clienteEliminado) throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    return clienteEliminado;
  }

  //-- 7. Elimina varios clientes en cascada ------------------------------------------------------------------------------------------
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
    return clientesToDelete;
  }

  //-- MASCOTAS - CRUD ---------------------------------------------------------------------------------------------------------------
  //-- 1. Encuentra a una mascota por nombre, especie o raza -------------------------------------------------------------------------
  async findMascotaByNombre(nombre: string): Promise<Mascota[]> {
    if (!nombre) {
      return [];
    }
    
    return this.buscarPorCampo(this.mascotaModel, ['nombre', 'especie', 'raza'], nombre);
  }

  //-- 2. Encuentra a una mascota por el ID de su dueño ------------------------------------------------------------------------------
  async findMascotasByClienteId(clienteId: string): Promise<Mascota[]> {
    const cliente = await this.clienteModel.findById(clienteId).exec();
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    const mascotas = await this.mascotaModel.find({
      _id: { $in: cliente.mascotas }
    }).exec();
    return mascotas; 
  }


  //-- 3. Crea una mascota y le asocia un historial médico ------------------------------------------------------------------
  async createMascota(createMascotaDto: CreateMascotaDto): Promise<Mascota> {
    
    const nuevaMascota = new this.mascotaModel(createMascotaDto);
    const mascotaGuardada = await nuevaMascota.save();
    const historialMedico = {
      mascotaID: mascotaGuardada._id, 
      entradas: []  
    };

    const nuevoHistorial = new this.historialMedicoModel(historialMedico);
    const historialGuardado = await nuevoHistorial.save();
    await this.mascotaModel.findByIdAndUpdate(mascotaGuardada._id, {
      $set: { historialMedico: historialGuardado._id } 
    });

    
    if (mascotaGuardada.cliente) {
      await this.clienteModel.findByIdAndUpdate(mascotaGuardada.cliente, {
        $push: { mascotas: mascotaGuardada._id },
      });
    }

    
    return mascotaGuardada;
  }

  //-- 4. Encuentra a todas las mascotas --------------------------------------------------------------------------------------------
  async findAllMascotas(): Promise<Mascota[]> {
    return this.mascotaModel.find().exec();
  }

  //-- 5. Encuentra a una mascota por ID --------------------------------------------------------------------------------------------
  async findMascotaById(id: string): Promise<Mascota> {
    const mascota = await this.mascotaModel.findById(id).exec();
    if (!mascota) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    return mascota;
  }

  //-- 6. Actualiza una mascota por ID ----------------------------------------------------------------------------------------------
  async updateMascota(id: string, updateMascotaDto: UpdateMascotaDto): Promise<Mascota> {
    const mascotaActualizada = await this.mascotaModel.findByIdAndUpdate(id, updateMascotaDto, { new: true });
    if (!mascotaActualizada) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    return mascotaActualizada;
  }

  //-- 7. Elimina una mascota por ID -----------------------------------------------------------------------------------------------
  async deleteMascota(id: string): Promise<Mascota> {
    const mascotaEliminada = await this.mascotaModel.findByIdAndDelete(id).exec();
    if (!mascotaEliminada) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    return mascotaEliminada;
  }


  //-- 8. Elimina multiples mascotas seleccionadas ----------------------------------------------------------------------------------------
  async deleteMultipleMascotas(ids: string[]): Promise<Mascota[]> {
    
    const mascotasAEliminar = await this.mascotaModel
      .find({ _id: { $in: ids } })
      .exec();

    if (mascotasAEliminar.length === 0) {
      throw new NotFoundException('No mascotas found to delete.');
    }

    
    const result = await this.mascotaModel
      .deleteMany({ _id: { $in: ids } })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No mascotas found to delete.');
    }

    
    return mascotasAEliminar;
  }

  //-- 9. Agrega una mascota a un cliente existente o crea uno nuevo si no existe ---------------------------------------------------
  async agregarMascotaACliente(clienteId: string, mascotaData: CreateMascotaDto): Promise<Cliente> {
    
    let cliente = await this.clienteModel.findById(clienteId);
    
    
    if (!cliente) {
      cliente = await this.clienteModel.create({
        nombre: mascotaData.nombre, 
        apellido: 'default',
        email: 'default@email.com',
        telefono: '00000000',
        direccion: 'default address',
        mascotas: [] 
      });
    }

    
    const nuevaMascota = new this.mascotaModel({
      nombre: mascotaData.nombre,
      especie: mascotaData.especie,
      raza: mascotaData.raza,
      fechaNacimiento: mascotaData.fechaNacimiento,
      peso: mascotaData.peso,
      caracteristicas: mascotaData.caracteristicas,
      cliente: cliente._id
    });

    const mascotaGuardada = await nuevaMascota.save();

    
    cliente.mascotas.push(mascotaGuardada._id);
    await cliente.save();

    
    const historialMedico = new this.historialMedicoModel({
      mascotaID: mascotaGuardada._id,
      entradas: []
    });

    const historialGuardado = await historialMedico.save();

    
    mascotaGuardada.historialMedico = historialGuardado;  
    await mascotaGuardada.save();

    
    const clientePoblado = await this.findClienteById(cliente._id);
    return {
      ...clientePoblado,
      mascotas: clientePoblado.mascotas
        .map(mascota => mascota._id)
        .filter((id): id is string => id !== undefined), 
    };
  }

  //-- CITAS - CRUD ---------------------------------------------------------------------------------------------------------------
  //-- 1. Encuentra citas por cliente, mascota, veterinario o servicio prestado ---------------------------------------------------
  async findCitasByCampo(search: string): Promise<Cita[]> {
    const filtro = search.toLowerCase();

    const citas = await this.citaModel
      .find()
      .populate('cliente')
      .populate('mascota')
      .populate('veterinario')
      .populate('servicioPrestado')
      .exec();

    return citas.filter(cita => {
      const cliente = cita.cliente as any;
      const mascota = cita.mascota as any;

      return (
        cliente?.nombre?.toLowerCase().includes(filtro) ||
        cliente?.apellido?.toLowerCase().includes(filtro) ||
        mascota?.nombre?.toLowerCase().includes(filtro) ||
        mascota?._id?.toString().includes(filtro) ||
        cita.motivo?.toLowerCase().includes(filtro) ||
        cita.observaciones?.toLowerCase().includes(filtro)
      );
    });
  }

  //-- 2. Crea una cita y la asocia a un historial médico -------------------------------------------------------------------
  async createCita(createCitaDto: CreateCitaDto): Promise<Cita> {
    
    const nuevaCita = new this.citaModel(createCitaDto);
    const citaGuardada = await nuevaCita.save();
    console.log('✅ Cita guardada con ID:', citaGuardada._id);

    
    const entrada = {
      cita:          citaGuardada._id,
      veterinario:   createCitaDto.veterinario,
      fecha:         new Date(createCitaDto.fechaHora),
      diagnosticos:  '',
      tratamientos:  '',
      observaciones: createCitaDto.observaciones || ''
    };

    
    let historial = await this.historialMedicoModel.findOne({
      mascotaID: createCitaDto.mascota
    });

    if (historial) {
      
      historial.entradas.push(entrada);
      await historial.save();
      console.log('✅ Entrada añadida al historial existente');
    } else {
      
      historial = await this.historialMedicoModel.create({
        mascotaID: createCitaDto.mascota,
        entradas:  [entrada]
      });
      console.log('✅ Historial creado con la primera entrada');
    }

    
    return citaGuardada;
  }

  //-- 3. Encuentra todas las citas -----------------------------------------------------------------------------------------------
  async findAllCitas(): Promise<Cita[]> {
    return this.citaModel.find()
    .populate('mascota')
    .populate('cliente')
    .populate('veterinario')
    .populate('servicioPrestado')
    .exec();
  }

  //-- 4. Encuentra una cita por ID -----------------------------------------------------------------------------------------------
  async findCitaById(id: string): Promise<Cita> {
    const cita = await this.citaModel.findById(id).exec();
    if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return cita;
  }

  //-- 5. Actualiza una cita por ID --------------------------------------------------------------------------------------------
  async updateCita(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const citaActualizada = await this.citaModel.findByIdAndUpdate(id, updateCitaDto, { new: true });
    if (!citaActualizada) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return citaActualizada;
  }

  //-- 6. Elimina una cita por ID -----------------------------------------------------------------------------------------------
  async deleteCita(id: string): Promise<Cita> {
    const citaEliminada = await this.citaModel.findByIdAndDelete(id).exec();
    if (!citaEliminada) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return citaEliminada;
  }

  //-- 7. Elimina varias citas seleccionadas ----------------------------------------------------------------------------------------
  async deleteMultipleCitas(ids: string[]): Promise<Cita[]> {
    
    const citasAEliminar = await this.citaModel
      .find({ _id: { $in: ids } })
      .exec();

    if (citasAEliminar.length === 0) {
      throw new NotFoundException('No citas found to delete.');
    }

    
    const result = await this.citaModel
      .deleteMany({ _id: { $in: ids } })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No citas found to delete.');
    }

    
    return citasAEliminar;
  }


  //-- 8. Encuentra citas por ID de mascota ----------------------------------------------------------------------------------------
  async findCitasByMascotaId(mascotaId: string) {
    
    const citas = await this.citaModel.find({ mascota: mascotaId }).exec();
    return citas;
  }

  //-- 9. Encuentra citas por ID de veterinario y fecha ---------------------------------------------------------------------------
  async findCitasPorVeterinarioYFecha(
    veterinarioId: string,
    fecha: string,        
  ): Promise<Cita[]> {
    
    const dia = new Date(fecha);
    const inicio = new Date(dia.setHours(0, 0, 0, 0));
    const fin =    new Date(dia.setHours(23, 59, 59, 999));
  
    return this.citaModel
      .find({
        veterinario: veterinarioId,
        fechaHora: { $gte: inicio, $lte: fin },
      })
      .exec();
  }


  //-- FACTURACIÓN - CRUD ---------------------------------------------------------------------------------------------------------------
  //-- 1. Encuentra a una mascota por nombre, especie o raza -------------------------------------------------------------------------
  async findFacturacionByConcepto(search: string): Promise<Facturacion[]> {
    return this.buscarPorCampo(this.facturacionModel, ['concepto', 'detalle'], search);
  }

  //-- 2. Crea una factura -----------------------------------------------------------------------------------------------
  async createFacturacion(createFacturacionDto: CreateFacturacionDto): Promise<Facturacion> {
    const nuevaFacturacion = new this.facturacionModel(createFacturacionDto);
    return nuevaFacturacion.save();
  }

  //-- 3. Encuentra todas las facturas --------------------------------------------------------------------------------------------
  async findAllFacturacion(): Promise<Facturacion[]> {
    return this.facturacionModel.find().exec();
  }

  //-- 4. Encuentra una factura por ID --------------------------------------------------------------------------------------------
  async findFacturacionById(id: string): Promise<Facturacion> {
    const facturacion = await this.facturacionModel.findById(id).exec();
    if (!facturacion) throw new NotFoundException(`Facturación con ID ${id} no encontrada`);
    return facturacion;
  }

  //-- 5. Actualiza una factura por ID --------------------------------------------------------------------------------------------
  async updateFacturacion(id: string, updateFacturacionDto: UpdateFacturacionDto): Promise<Facturacion> {
    const facturacionActualizada = await this.facturacionModel.findByIdAndUpdate(id, updateFacturacionDto, { new: true });
    if (!facturacionActualizada) throw new NotFoundException(`Facturación con ID ${id} no encontrada`);
    return facturacionActualizada;
  }

  //-- 6. Elimina una factura por ID ---------------------------------------------------------------------------------------------
  async deleteFacturacion(id: string): Promise<Facturacion> {
    const facturacionEliminada = await this.facturacionModel.findByIdAndDelete(id).exec();
    if (!facturacionEliminada) throw new NotFoundException(`Facturación con ID ${id} no encontrada`);
    return facturacionEliminada;
  }

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

  
  

  //-- SERVICIOS PRESTADOS - CRUD ---------------------------------------------------------------------------------------------------
  //-- 1. Encuentra servicios prestados por nombre o descripción ---------------------------------------------------------------------
  async createServicioPrestado(createServicioPrestadoDto: CreateServicioPrestadoDto): Promise<ServicioPrestado> {
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
  async updateServicioPrestado(id: string, updateServicioPrestadoDto: UpdateServicioPrestadoDto): Promise<ServicioPrestado> {
    const servicioActualizado = await this.servicioPrestadoModel.findByIdAndUpdate(id, updateServicioPrestadoDto, { new: true });
    if (!servicioActualizado) throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicioActualizado;
  }

  //-- 5. Elimina un servicio prestado por ID -----------------------------------------------------------------------------------
  async deleteServicioPrestado(id: string): Promise<ServicioPrestado> {
    const servicioEliminado = await this.servicioPrestadoModel.findByIdAndDelete(id).exec();
    if (!servicioEliminado) throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicioEliminado;
  }

  //-- 6. Elimina varios servicios prestados seleccionados ------------------------------------------------------------------------
  async deleteMultipleServiciosPrestados(ids: string[]): Promise<ServicioPrestado[]> {
    
    const serviciosAEliminar = await this.servicioPrestadoModel
      .find({ _id: { $in: ids } })
      .exec();

    if (serviciosAEliminar.length === 0) {
      throw new NotFoundException('No servicios prestados found to delete.');
    }

    
    const result = await this.servicioPrestadoModel
      .deleteMany({ _id: { $in: ids } })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No servicios prestados found to delete.');
    }

    
    return serviciosAEliminar;
  }

  //-- 7. Encuentra servicios prestados por nombre o descripción ---------------------------------------------------------------------
  async findServicioByNombre(nombre: string): Promise<ServicioPrestado[]> {
    return this.buscarPorCampo(this.servicioPrestadoModel, ['nombre', 'descripcion'], nombre);
  }



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
