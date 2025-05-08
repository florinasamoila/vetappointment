import { HistorialMedico } from "../../../historial-medico/interfaces/historial-medico/historial-medico.interface";

export interface Mascota {
    _id: string;
    nombre: string;
    especie: string;
    raza: string;
    fechaNacimiento: Date;
    peso: number;
    caracteristicas: string;
    cliente: string;
    historialMedico?: HistorialMedico;
  }
  