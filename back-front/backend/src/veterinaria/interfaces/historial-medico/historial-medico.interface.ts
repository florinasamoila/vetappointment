export interface EntradaHistorial {
  cita: string;
  veterinario: string;
  fecha: Date;
  diagnosticos: string;
  tratamientos: string;
  observaciones?: string;
}

export interface HistorialMedico {
  _id: string;
  mascotaID: string;
  entradas: EntradaHistorial[];
}
