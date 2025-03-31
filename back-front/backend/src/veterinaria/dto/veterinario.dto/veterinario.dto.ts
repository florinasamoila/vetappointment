import { CitaDto } from "../cita.dto/cita.dto";


export class VeterinarioDto {
  _id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  telefono: string;
  citas: CitaDto[];       
}
