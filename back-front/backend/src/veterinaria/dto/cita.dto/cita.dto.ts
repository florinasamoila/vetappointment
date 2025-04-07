
import { ClienteDto } from "../cliente.dto/cliente.dto";
import { MascotaDto } from "../mascota.dto/mascota.dto";
import { ServicioPrestadoDto } from "../servicio-prestado.dto/servicio-prestado.dto";
import { VeterinarioDto } from "../veterinario.dto/veterinario.dto";


export class CitaDto {
  _id: string;
  fechaHora: Date;
  motivo: string;
  estado: {
    type: String,
    enum: ['Programada', 'Confirmada', 'Cancelada', 'Completada'],
    default: 'Programada'
  }
  
  cliente: ClienteDto;     
  mascota: MascotaDto;      
  veterinario: VeterinarioDto; 
  servicioPrestado: ServicioPrestadoDto;    
}
