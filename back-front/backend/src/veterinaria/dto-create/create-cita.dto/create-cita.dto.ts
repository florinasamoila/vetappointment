export enum EstadoCita {
  Programada = 'Programada',
  Confirmada = 'Confirmada',
  Cancelada = 'Cancelada',
  Completada = 'Completada',
}

export class CreateCitaDto {
    fechaHora: Date;
    motivo: string;
    estado: EstadoCita;           
    cliente: string;          
    mascota: string;         
    veterinario: string;      
    servicioPrestado: string; 
  }