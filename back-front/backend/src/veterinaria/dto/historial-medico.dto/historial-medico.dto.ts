import { CitaDto } from "../cita.dto/cita.dto";


export class HistorialMedicoDto {
  _id: string;
  cita: CitaDto;          
  diagnosticos: string;
  tratamientos: string;
  observaciones: string;
}
