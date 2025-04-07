import { Injectable, NotFoundException } from '@nestjs/common';
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

// Todos los CRUD están comentados por categopría, para encontrarlos más fácilmente.

@Injectable()
export class VeterinariaService {
  
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
    try {
      const cliente = await this.clienteModel.create({
        ...createClienteDto,
        mascotas: [],
      });

      console.log('📌 Cliente creado en la BD:', cliente);

      if (createClienteDto.mascotas && createClienteDto.mascotas.length > 0) {
        console.log('📌 Registrando mascotas para el cliente:', createClienteDto.mascotas);

        await Promise.all(
          createClienteDto.mascotas.map(async (mascotaDto) => {
            console.log('📌 Creando mascota en la BD:', mascotaDto);
            const mascota = await this.mascotaModel.create({
              ...mascotaDto,
              cliente: cliente._id,
            });
            console.log('✅ Mascota guardada:', mascota);
        
            // 👉 Asociar mascota al cliente
            await this.clienteModel.findByIdAndUpdate(cliente._id, {
              $push: { mascotas: mascota._id },
            });
          })
        );
        

        
      }

      return this.findClienteById(cliente._id);
    } catch (error) {
      console.error('❌ Error al registrar el cliente y sus mascotas:', error);
      throw new Error('Error al registrar el cliente y las mascotas.');
    }
  }




  async findAllClientes(): Promise<Cliente[]> {
    return this.clienteModel.find().exec();
  }

  async findClientByName(nombre: string): Promise<Cliente[]> {
    return this.clienteModel.find({
      nombre: { $regex: nombre, $options: 'i' } // búsqueda insensible a mayúsculas
    }).exec();
  }
  

  async findClienteById(id: string): Promise<ClienteDto> {
    const cliente = await this.clienteModel
      .findById(id)
      .populate({ path: 'mascotas', model: 'Mascota' }) // 📌 populate correcto
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
        cliente: mascota.cliente,
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

//  CRUD para Mascotas

async findMascotaByNombre(nombre: string): Promise<Mascota[]> {
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
  const nuevaMascota = new this.mascotaModel(createMascotaDto);

  // ✅ Guardar mascota
  const mascotaGuardada = await nuevaMascota.save();

  // ✅ Asociar mascota al cliente
  if (mascotaGuardada.cliente) {
    await this.clienteModel.findByIdAndUpdate(mascotaGuardada.cliente, {
      $push: { mascotas: mascotaGuardada._id },
    });
  }

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

//  CRUD para Cita

async findCitasByCampo(search: string): Promise<Cita[]> {
  return this.buscarPorCampo(this.citaModel, ['motivo', 'observaciones'], search);
}

   async createCita(createCitaDto: CreateCitaDto): Promise<Cita> {
    const nuevaCita = new this.citaModel(createCitaDto);
    return nuevaCita.save();
  }

  async findAllCitas(): Promise<Cita[]> {
    return this.citaModel.find().exec();
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

async findHistorialByDescripcion(texto: string): Promise<HistorialMedico[]> {
  return this.buscarPorCampo(this.historialMedicoModel, ['descripcion'], texto);
}
  async createHistorialMedico(createHistorialMedicoDto: CreateHistorialMedicoDto): Promise<HistorialMedico> {
    const nuevoHistorial = new this.historialMedicoModel(createHistorialMedicoDto);
    return nuevoHistorial.save();
  }

  async findAllHistorialesMedicos(): Promise<HistorialMedico[]> {
    return this.historialMedicoModel.find().exec();
  }

  async findHistorialMedicoById(id: string): Promise<HistorialMedico> {
    const historial = await this.historialMedicoModel.findById(id).exec();
    if (!historial) throw new NotFoundException(`Historial Médico con ID ${id} no encontrado`);
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

//  CRUD para Servicio Prestado

async findServicioByNombre(titulo: string): Promise<ServicioPrestado[]> {
  return this.buscarPorCampo(this.servicioPrestadoModel, ['titulo', 'descripcion'], titulo);
}
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

  // Función genérica para búsqueda por nombre/título en cualquier colección
private async buscarPorCampo(
  model: Model<any>,
  campos: string[],
  search: string
): Promise<any[]> {
  const orConditions = campos.map(campo => ({
    [campo]: { $regex: search, $options: 'i' },
  }));

  return model.find({ $or: orConditions }).exec();
}

}
