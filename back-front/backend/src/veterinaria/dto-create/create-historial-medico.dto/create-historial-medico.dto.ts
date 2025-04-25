// create-historial-medico.dto.ts
export class CreateHistorialMedicoDto {
  mascotaID: string;
  entrada: {
    cita: string;
    veterinario: string;
    fecha: Date;
    diagnosticos: string;
    tratamientos: string;
    observaciones?: string;
  };
}
