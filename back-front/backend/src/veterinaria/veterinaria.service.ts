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
import { MascotaDto } from './dto/mascota.dto/mascota.dto'; // Ensure this path is correct
import { AddEntradaHistorialDto } from './dto/historial-medico.dto/add-entrada-historial.dto';

// Todos los CRUD están comentados por categopría, para encontrarlos más fácilmente.

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

//  CRUD para Clientes

async createCliente(createClienteDto: CreateClienteDto): Promise<ClienteDto> {
  // Verificar si el cliente ya existe por email
  let clienteExistente = await this.clienteModel.findOne({
    email: createClienteDto.email, // Usamos el email como identificador único
  });

  // Si el cliente ya existe, actualizamos las mascotas
  if (clienteExistente) {
    // Si existen nuevas mascotas
    if (createClienteDto.mascotas && createClienteDto.mascotas.length > 0) {
      // Creamos un array para almacenar las nuevas mascotas
      const nuevasMascotas: ObjectId[] = [];

      // Verificar y crear nuevas mascotas
      for (const mascotaDto of createClienteDto.mascotas) {
        let mascotaExistente = await this.mascotaModel.findOne({
          nombre: mascotaDto.nombre,
          cliente: clienteExistente._id,
        });

        if (!mascotaExistente) {
          // Crear una nueva mascota si no existe
          const nuevaMascota = await this.mascotaModel.create({
            ...mascotaDto,
            cliente: clienteExistente._id, // Asociar la mascota al cliente
          });

          // Crear el historial médico para la nueva mascota
          const historialMedico = new this.historialMedicoModel({
            mascotaID: nuevaMascota._id,
            entradas: [],  // Inicialmente vacío
          });

          await historialMedico.save();
          nuevaMascota.historialMedico = historialMedico as unknown as HistorialMedico;
          await nuevaMascota.save();

          // Añadir la mascota al array
          nuevasMascotas.push(nuevaMascota._id as unknown as ObjectId);
        }
      }

      // Agregar las nuevas mascotas al cliente
      if (nuevasMascotas.length > 0) {
        clienteExistente.mascotas.push(...nuevasMascotas.map(mascotaId => mascotaId.toString()));
        await clienteExistente.save();
      }
    }

    return this.findClienteById(clienteExistente._id); // Retornar cliente actualizado
  }

  // Si el cliente no existe, creamos uno nuevo
  const cliente = await this.clienteModel.create({
    ...createClienteDto,
    mascotas: [], // Inicializamos con un array vacío de mascotas
  });

  // Crear y asociar las mascotas al cliente nuevo
  if (createClienteDto.mascotas && createClienteDto.mascotas.length > 0) {
    const nuevasMascotas: ObjectId[] = [];
    for (const mascotaDto of createClienteDto.mascotas) {
      const mascota = await this.mascotaModel.create({
        ...mascotaDto,
        cliente: cliente._id, // Asociar la mascota al cliente
      });

      nuevasMascotas.push(mascota._id as unknown as ObjectId);

      // Crear el historial médico para la mascota
      const historialMedico = new this.historialMedicoModel({
        mascotaID: mascota._id,
        entradas: [],
      });

      await historialMedico.save();
    }

    cliente.mascotas.push(...nuevasMascotas.map(mascotaId => mascotaId.toString()));
    await cliente.save();
  }

  return this.findClienteById(cliente._id);  // Devolver cliente con mascotas
}



  async findAllClientes(): Promise<Cliente[]> {
    return this.clienteModel.find().exec();
  }

// veterinaria.service.ts

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

  
  

  async findClienteById(id: string): Promise<ClienteDto> {
    const cliente = await this.clienteModel
      .findById(id)
      .populate('mascotas')  // Populate the Mascotas field
      .exec();
  
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  
    // Map the populated mascotas to the appropriate DTO
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
        cliente: mascota.cliente.toString(),  // Link back to the Cliente ID
      })),
    };
  }
  
  

  async updateCliente(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const clienteActualizado = await this.clienteModel.findByIdAndUpdate(id, updateClienteDto, { new: true });
    if (!clienteActualizado) throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    return clienteActualizado;
  }

  async deleteCliente(id: string): Promise<Cliente> {
    const clienteEliminado = await this.clienteModel.findByIdAndDelete(id).exec();
    if (!clienteEliminado) throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    return clienteEliminado;
  }

  // Add this method to your VeterinariaService class
  async deleteMultipleClientes(ids: string[]): Promise<Cliente[]> {
    // 1) Obtener los clientes a eliminar
    const clientesToDelete = await this.clienteModel.find({ _id: { $in: ids } }).exec();
    if (!clientesToDelete.length) {
      throw new NotFoundException('No se encontraron clientes para eliminar.');
    }

    // 2) Obtener las mascotas de esos clientes
    const mascotas = await this.mascotaModel.find({ cliente: { $in: ids } }).exec();
    const mascotaIds = mascotas.map(m => m._id);

    // 3) Borrar todas las citas vinculadas a esos clientes O a esas mascotas
    await this.citaModel.deleteMany({
      $or: [
        { cliente: { $in: ids } },
        { mascota: { $in: mascotaIds } }
      ]
    }).exec();

    // 4) Borrar historiales médicos de esas mascotas
    await this.historialMedicoModel.deleteMany({ mascotaID: { $in: mascotaIds } }).exec();

    // 5) Borrar las mascotas mismas
    await this.mascotaModel.deleteMany({ cliente: { $in: ids } }).exec();

    // 6) Por último, borrar los clientes
    await this.clienteModel.deleteMany({ _id: { $in: ids } }).exec();

    // 7) Devolver los clientes que efectivamente fueron eliminados
    return clientesToDelete;
  }
  


//  CRUD para Mascotas

async findMascotaByNombre(nombre: string): Promise<Mascota[]> {
  if (!nombre) {
    return [];
  }
  
  return this.buscarPorCampo(this.mascotaModel, ['nombre', 'especie', 'raza'], nombre);
}


async findMascotasByClienteId(clienteId: string): Promise<Mascota[]> {
  const cliente = await this.clienteModel.findById(clienteId).exec();

  if (!cliente) {
    throw new NotFoundException('Cliente no encontrado');
  }

  const mascotas = await this.mascotaModel.find({
    _id: { $in: cliente.mascotas }
  }).exec();

  return mascotas; // 👈 devuelve los objetos completos
}



async createMascota(createMascotaDto: CreateMascotaDto): Promise<Mascota> {
  // Crear una nueva mascota
  const nuevaMascota = new this.mascotaModel(createMascotaDto);

  // Guardar la mascota
  const mascotaGuardada = await nuevaMascota.save();

  // Crear el historial médico para la mascota
  const historialMedico = {
    mascotaID: mascotaGuardada._id, // Asociar el historial médico con la mascota
    entradas: []  // Comenzamos con un historial vacío
  };

  // Crear el historial médico y guardarlo
  const nuevoHistorial = new this.historialMedicoModel(historialMedico);
  const historialGuardado = await nuevoHistorial.save();

  // Asociar el historial médico con la mascota
  await this.mascotaModel.findByIdAndUpdate(mascotaGuardada._id, {
    $set: { historialMedico: historialGuardado._id } // Actualiza el campo historialMedico con el ID del historial
  });

  // Asociar la mascota al cliente (ya lo estás haciendo correctamente)
  if (mascotaGuardada.cliente) {
    await this.clienteModel.findByIdAndUpdate(mascotaGuardada.cliente, {
      $push: { mascotas: mascotaGuardada._id },
    });
  }

  // Retornar la mascota con el historial médico asociado
  return mascotaGuardada;
}








  async findAllMascotas(): Promise<Mascota[]> {
    return this.mascotaModel.find().exec();
  }

  async findMascotaById(id: string): Promise<Mascota> {
    const mascota = await this.mascotaModel.findById(id).exec();
    if (!mascota) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    return mascota;
  }

  async updateMascota(id: string, updateMascotaDto: UpdateMascotaDto): Promise<Mascota> {
    const mascotaActualizada = await this.mascotaModel.findByIdAndUpdate(id, updateMascotaDto, { new: true });
    if (!mascotaActualizada) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    return mascotaActualizada;
  }

  async deleteMascota(id: string): Promise<Mascota> {
    const mascotaEliminada = await this.mascotaModel.findByIdAndDelete(id).exec();
    if (!mascotaEliminada) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    return mascotaEliminada;
  }

  // Eliminar múltiples mascotas
// Eliminar múltiples mascotas
async deleteMultipleMascotas(ids: string[]): Promise<Mascota[]> {
  // Primero, buscar las mascotas que se van a eliminar
  const mascotasAEliminar = await this.mascotaModel
    .find({ _id: { $in: ids } })
    .exec();

  if (mascotasAEliminar.length === 0) {
    throw new NotFoundException('No mascotas found to delete.');
  }

  // Realizar la eliminación
  const result = await this.mascotaModel
    .deleteMany({ _id: { $in: ids } })
    .exec();

  if (result.deletedCount === 0) {
    throw new NotFoundException('No mascotas found to delete.');
  }

  // Devolver las mascotas eliminadas
  return mascotasAEliminar;
}

// src/veterinaria/veterinaria.service.ts
async agregarMascotaACliente(clienteId: string, mascotaData: CreateMascotaDto): Promise<Cliente> {
  // 1. Verificar si el cliente existe
  let cliente = await this.clienteModel.findById(clienteId);
  
  // Si el cliente no existe, creamos un nuevo cliente
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

  // 2. Crear la nueva mascota
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

  // 3. Asociar la mascota al cliente
  cliente.mascotas.push(mascotaGuardada._id);
  await cliente.save();

  // 4. Crear el historial médico vacío para la nueva mascota
  const historialMedico = new this.historialMedicoModel({
    mascotaID: mascotaGuardada._id,
    entradas: []
  });

  const historialGuardado = await historialMedico.save();

  // 5. Asociar el historial médico a la mascota
  mascotaGuardada.historialMedico = historialGuardado;  // Asignamos el objeto completo de HistorialMedico
  await mascotaGuardada.save();

  // 6. Retornar el cliente con la nueva mascota agregada
  const clientePoblado = await this.findClienteById(cliente._id);
  return {
    ...clientePoblado,
    mascotas: clientePoblado.mascotas
      .map(mascota => mascota._id)
      .filter((id): id is string => id !== undefined), // Ensure all IDs are strings
  };
}

//  CRUD para Cita

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

// veterinaria.service.ts
async createCita(createCitaDto: CreateCitaDto): Promise<Cita> {
  // 1) Guardar la cita
  const nuevaCita = new this.citaModel(createCitaDto);
  const citaGuardada = await nuevaCita.save();
  console.log('✅ Cita guardada con ID:', citaGuardada._id);

  // 2) Construir la entrada de historial para esta cita
  const entrada = {
    cita:          citaGuardada._id,
    veterinario:   createCitaDto.veterinario,
    fecha:         createCitaDto.fechaHora,
    diagnosticos:  '',
    tratamientos:  '',
    observaciones: createCitaDto.observaciones || ''
  };

  // 3) Buscar el historial médico de esta mascota
  let historial = await this.historialMedicoModel.findOne({
    mascotaID: createCitaDto.mascota
  });

  if (historial) {
    // → Si hay historial, siempre agregamos la nueva entrada
    historial.entradas.push(entrada);
    await historial.save();
    console.log('✅ Entrada añadida al historial existente');
  } else {
    // → Si no existe historial (caso excepcional), lo creamos con esta entrada
    historial = await this.historialMedicoModel.create({
      mascotaID: createCitaDto.mascota,
      entradas:  [entrada]
    });
    console.log('✅ Historial creado con la primera entrada');
  }

  // 4) Devolver la cita creada
  return citaGuardada;
}








  async findAllCitas(): Promise<Cita[]> {
    return this.citaModel.find()
    .populate('mascota')
    .populate('cliente')
    .populate('veterinario')
    .populate('servicioPrestado')
    .exec();
  }
  

  async findCitaById(id: string): Promise<Cita> {
    const cita = await this.citaModel.findById(id).exec();
    if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return cita;
  }

  async updateCita(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const citaActualizada = await this.citaModel.findByIdAndUpdate(id, updateCitaDto, { new: true });
    if (!citaActualizada) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return citaActualizada;
  }

  async deleteCita(id: string): Promise<Cita> {
    const citaEliminada = await this.citaModel.findByIdAndDelete(id).exec();
    if (!citaEliminada) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return citaEliminada;
  }

// Eliminar múltiples citas
async deleteMultipleCitas(ids: string[]): Promise<Cita[]> {
  // Buscar las citas antes de eliminarlas
  const citasAEliminar = await this.citaModel
    .find({ _id: { $in: ids } })
    .exec();

  if (citasAEliminar.length === 0) {
    throw new NotFoundException('No citas found to delete.');
  }

  // Eliminar las citas
  const result = await this.citaModel
    .deleteMany({ _id: { $in: ids } })
    .exec();

  if (result.deletedCount === 0) {
    throw new NotFoundException('No citas found to delete.');
  }

  // Devolver las citas eliminadas
  return citasAEliminar;
}




  async findCitasByMascotaId(mascotaId: string) {
    // Aquí debes realizar la consulta de citas relacionadas con la mascota
    const citas = await this.citaModel.find({ mascota: mascotaId }).exec();
    return citas;
  }

  async findCitasPorVeterinarioYFecha(
    veterinarioId: string,
    fecha: string,        // "YYYY-MM-DD"
  ): Promise<Cita[]> {
    // Parsear inicio y fin de día
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

//  CRUD para Facturacion

async findFacturacionByConcepto(search: string): Promise<Facturacion[]> {
  return this.buscarPorCampo(this.facturacionModel, ['concepto', 'detalle'], search);
}
  async createFacturacion(createFacturacionDto: CreateFacturacionDto): Promise<Facturacion> {
    const nuevaFacturacion = new this.facturacionModel(createFacturacionDto);
    return nuevaFacturacion.save();
  }

  async findAllFacturacion(): Promise<Facturacion[]> {
    return this.facturacionModel.find().exec();
  }

  async findFacturacionById(id: string): Promise<Facturacion> {
    const facturacion = await this.facturacionModel.findById(id).exec();
    if (!facturacion) throw new NotFoundException(`Facturación con ID ${id} no encontrada`);
    return facturacion;
  }

  async updateFacturacion(id: string, updateFacturacionDto: UpdateFacturacionDto): Promise<Facturacion> {
    const facturacionActualizada = await this.facturacionModel.findByIdAndUpdate(id, updateFacturacionDto, { new: true });
    if (!facturacionActualizada) throw new NotFoundException(`Facturación con ID ${id} no encontrada`);
    return facturacionActualizada;
  }

  async deleteFacturacion(id: string): Promise<Facturacion> {
    const facturacionEliminada = await this.facturacionModel.findByIdAndDelete(id).exec();
    if (!facturacionEliminada) throw new NotFoundException(`Facturación con ID ${id} no encontrada`);
    return facturacionEliminada;
  }

//  CRUD para Historial Médico

// veterinaria.service.ts
// veterinaria.service.ts
// veterinaria.service.ts
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


  // Verificar si la mascota tiene citas antes de permitir agregar una entrada al historial
  async verificarCitasAntesDeAgregarEntrada(mascotaId: string): Promise<boolean> {
    const citas = await this.citaModel.find({ mascota: mascotaId });
    return citas.length > 0;  // Devuelve true si hay citas, false si no hay
  }


// Método para obtener historial médico de una mascota a través de su ID





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


async findHistorialByDescripcion(texto: string): Promise<HistorialMedico[]> {
  // Primero buscamos las mascotas que coincidan por nombre
  const mascotasCoincidentes = await this.mascotaModel.find({
    nombre: { $regex: texto, $options: 'i' }
  }).select('_id').exec();

  const idsMascotas = mascotasCoincidentes.map(m => m._id);

  return this.historialMedicoModel.find({
    mascotaID: { $in: idsMascotas }
  })
  .populate('mascotaID')  // 👈 importante para mostrar el nombre
  .exec();
}

  async createHistorialMedico(createHistorialMedicoDto: CreateHistorialMedicoDto): Promise<HistorialMedico> {
    const nuevoHistorial = new this.historialMedicoModel(createHistorialMedicoDto);
    return nuevoHistorial.save();
  }

  async findAllHistorialesMedicos(): Promise<any[]> {
    const docs = await this.historialMedicoModel.find({}).lean().exec();
    console.log('🧾 Documentos en historialMedico:', docs);
    return docs;
  }
  
  
  
  

// veterinaria.service.ts

async findHistorialMedicoById(id: string): Promise<any> {
  const historial = await this.historialMedicoModel
    .findById(id)
    .lean()  // para tener un POJO y poder mapear libremente
    // Pobla la mascota y dentro de ella al cliente
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
    // Pobla cada entrada.cita y dentro de la cita sus refs
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
    // Pobla también el veterinario de la entrada (si lo quieres repetir aquí)
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

  

  async updateHistorialMedico(id: string, updateHistorialMedicoDto: UpdateHistorialMedicoDto): Promise<HistorialMedico> {
    const historialActualizado = await this.historialMedicoModel.findByIdAndUpdate(id, updateHistorialMedicoDto, { new: true });
    if (!historialActualizado) throw new NotFoundException(`Historial Médico con ID ${id} no encontrado`);
    return historialActualizado;
  }

  async deleteHistorialMedico(id: string): Promise<HistorialMedico> {
    const historialEliminado = await this.historialMedicoModel.findByIdAndDelete(id).exec();
    if (!historialEliminado) throw new NotFoundException(`Historial Médico con ID ${id} no encontrado`);
    return historialEliminado;
  }

// Eliminar múltiples historial médico
async deleteMultipleHistorialMedico(ids: string[]): Promise<HistorialMedico[]> {
  // Buscar los historiales médicos antes de eliminarlos
  const historialesAEliminar = await this.historialMedicoModel
    .find({ _id: { $in: ids } })
    .exec();

  if (historialesAEliminar.length === 0) {
    throw new NotFoundException('No historial médicos found to delete.');
  }

  // Eliminar los historiales médicos
  const result = await this.historialMedicoModel
    .deleteMany({ _id: { $in: ids } })
    .exec();

  if (result.deletedCount === 0) {
    throw new NotFoundException('No historial médicos found to delete.');
  }

  // Devolver los historiales médicos eliminados
  return historialesAEliminar;
}


  // Método para obtener historial médico de una mascota por su ID
// veterinaria.service.ts

async findHistorialPorMascota(mascotaId: string): Promise<HistorialMedico> {
  const historial = await this.historialMedicoModel
    .findOne({ mascotaID: mascotaId })
    .populate('entradas.cita') // Poblar la relación con Cita
    .populate('entradas.veterinario') // Poblar la relación con Veterinario
    .exec();

  if (!historial) {
    throw new NotFoundException(`Historial médico no encontrado para la mascota con ID ${mascotaId}`);
  }

  return historial;
}





//  CRUD para Servicio Prestado


  async createServicioPrestado(createServicioPrestadoDto: CreateServicioPrestadoDto): Promise<ServicioPrestado> {
    const nuevoServicio = new this.servicioPrestadoModel(createServicioPrestadoDto);
    return nuevoServicio.save();
  }



async findAllServiciosPrestados(): Promise<ServicioPrestado[]> {
  return this.servicioPrestadoModel.find().exec();
}

  

  async findServicioPrestadoById(id: string): Promise<ServicioPrestado> {
    const servicio = await this.servicioPrestadoModel.findById(id).exec();
    if (!servicio) throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicio;
  }

  async updateServicioPrestado(id: string, updateServicioPrestadoDto: UpdateServicioPrestadoDto): Promise<ServicioPrestado> {
    const servicioActualizado = await this.servicioPrestadoModel.findByIdAndUpdate(id, updateServicioPrestadoDto, { new: true });
    if (!servicioActualizado) throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicioActualizado;
  }

  async deleteServicioPrestado(id: string): Promise<ServicioPrestado> {
    const servicioEliminado = await this.servicioPrestadoModel.findByIdAndDelete(id).exec();
    if (!servicioEliminado) throw new NotFoundException(`Servicio Prestado con ID ${id} no encontrado`);
    return servicioEliminado;
  }
// Eliminar múltiples servicios prestados
async deleteMultipleServiciosPrestados(ids: string[]): Promise<ServicioPrestado[]> {
  // Buscar los servicios prestados antes de eliminarlos
  const serviciosAEliminar = await this.servicioPrestadoModel
    .find({ _id: { $in: ids } })
    .exec();

  if (serviciosAEliminar.length === 0) {
    throw new NotFoundException('No servicios prestados found to delete.');
  }

  // Eliminar los servicios prestados
  const result = await this.servicioPrestadoModel
    .deleteMany({ _id: { $in: ids } })
    .exec();

  if (result.deletedCount === 0) {
    throw new NotFoundException('No servicios prestados found to delete.');
  }

  // Devolver los servicios prestados eliminados
  return serviciosAEliminar;
}


  // veterinaria.service.ts

async findServicioByNombre(nombre: string): Promise<ServicioPrestado[]> {
  return this.buscarPorCampo(this.servicioPrestadoModel, ['nombre', 'descripcion'], nombre);
}


//  CRUD para Veterinario

async findVeterinarioByNombre(nombre: string): Promise<Veterinario[]> {
  return this.buscarPorCampo(this.veterinarioModel, ['nombre', 'apellido'], nombre);
}
  async createVeterinario(createVeterinarioDto: CreateVeterinarioDto): Promise<Veterinario> {
    const nuevoVeterinario = new this.veterinarioModel(createVeterinarioDto);
    return nuevoVeterinario.save();
  }

  async findAllVeterinarios(): Promise<Veterinario[]> {
    return this.veterinarioModel.find().exec();
  }

  async findVeterinarioById(id: string): Promise<Veterinario> {
    const veterinario = await this.veterinarioModel.findById(id).exec();
    if (!veterinario) throw new NotFoundException(`Veterinario con ID ${id} no encontrado`);
    return veterinario;
  }

  async updateVeterinario(id: string, updateVeterinarioDto: UpdateVeterinarioDto): Promise<Veterinario> {
    const veterinarioActualizado = await this.veterinarioModel.findByIdAndUpdate(id, updateVeterinarioDto, { new: true });
    if (!veterinarioActualizado) throw new NotFoundException(`Veterinario con ID ${id} no encontrado`);
    return veterinarioActualizado;
  }

  async deleteVeterinario(id: string): Promise<Veterinario> {
    const veterinarioEliminado = await this.veterinarioModel.findByIdAndDelete(id).exec();
    if (!veterinarioEliminado) throw new NotFoundException(`Veterinario con ID ${id} no encontrado`);
    return veterinarioEliminado;
  }

 // Eliminar múltiples veterinarios
async deleteMultipleVeterinarios(ids: string[]): Promise<Veterinario[]> {
  // Buscar los veterinarios antes de eliminarlos
  const veterinariosAEliminar = await this.veterinarioModel
    .find({ _id: { $in: ids } })
    .exec();

  if (veterinariosAEliminar.length === 0) {
    throw new NotFoundException('No veterinarios found to delete.');
  }

  // Eliminar los veterinarios
  const result = await this.veterinarioModel
    .deleteMany({ _id: { $in: ids } })
    .exec();

  if (result.deletedCount === 0) {
    throw new NotFoundException('No veterinarios found to delete.');
  }

  // Devolver los veterinarios eliminados
  return veterinariosAEliminar;
}


  // Función genérica para búsqueda por nombre/título en cualquier colección
  private async buscarPorCampo(
    model: Model<any>,
    campos: string[],
    search: string
  ): Promise<any[]> {
    // Validación para evitar errores con $regex
    if (!search || typeof search !== 'string') {
      return [];
    }
  
    // Generar condiciones OR con $regex para los campos indicados
    const orConditions = campos.map(campo => ({
      [campo]: { $regex: search, $options: 'i' },
    }));
  
    // Ejecutar la consulta
    return model.find({ $or: orConditions }).exec();
  }
  

}
