import { CitaDto } from "../cita.dto/cita.dto";

export class HistorialMedicoDto {
  _id: string;
  cita: CitaDto;
  mascotaID: string;           // 👈 ID de la mascota
  veterinario: string;         // 👈 ID del veterinario
  fecha: Date;                 // 👈 Fecha del historial
  diagnosticos: string;
  tratamientos: string;
  observaciones: string;
}
