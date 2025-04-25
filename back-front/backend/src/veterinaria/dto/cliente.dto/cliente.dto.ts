import { MascotaDto } from "../mascota.dto/mascota.dto";


export interface ClienteDto {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  mascotas: MascotaDto[];  // This should be an array of MascotaDto
}