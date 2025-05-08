import { Schema } from 'mongoose';

export const MascotaSchema = new Schema(
  {
    nombre: { type: String, required: true },
    especie: { type: String, required: true },
    raza: { type: String, required: true },
    fechaNacimiento: { type: Date, required: false, default: null },
    peso: { type: Number, required: true },
    caracteristicas: { type: String, default: null },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    historialMedico: { type: Schema.Types.ObjectId, ref: 'HistorialMedico' },
  },
  { versionKey: false },
);
