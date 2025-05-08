import { Schema } from 'mongoose';

export const HistorialMedicoSchema = new Schema({
  mascotaID: { type: Schema.Types.ObjectId, ref: 'Mascota', required: true },
  entradas: [
    {
      cita: { type: Schema.Types.ObjectId, ref: 'Cita' },
      veterinario: { type: Schema.Types.ObjectId, ref: 'Veterinario' },
      fecha: { type: Date },
      diagnosticos: { type: String },
      tratamientos: { type: String },
      observaciones: { type: String }
    }
  ]
}, { versionKey: false });
