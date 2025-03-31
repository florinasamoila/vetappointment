import { MascotaDto } from "../mascota.dto/mascota.dto";


export class ClienteDto {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  mascotas: MascotaDto[];  
}
