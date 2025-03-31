import { MascotaDto } from "src/veterinaria/dto/mascota.dto/mascota.dto";

export class CreateClienteDto {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    mascotas?: any[];
    
  }
  