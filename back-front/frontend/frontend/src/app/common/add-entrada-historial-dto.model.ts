export interface AddEntradaHistorialDto {
    cita: string;
    veterinario: string;
    fecha: Date;
    diagnosticos: string;
    tratamientos: string;
    observaciones?: string;
  }
  