export interface Cita {
  _id: string;
  fechaHora: Date;
  motivo: string;
  estado: string;
  cliente: string;
  mascota: string;
  veterinario: string;
  servicioPrestado: string;
  observaciones?: string;
}
