import { Schema } from 'mongoose';

export const CitaSchema = new Schema(
  {
    fechaHora: { type: Date, required: true },
    motivo: { type: String, required: true },
    estado: {
      type: String,
      required: true,
      enum: ['Programada', 'Confirmada', 'Cancelada', 'Completada'],
      default: 'Programada',
    },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true }, // ✅
    mascota: { type: Schema.Types.ObjectId, ref: 'Mascota', required: true }, // ✅
    veterinario: { type: Schema.Types.ObjectId, ref: 'Veterinario', required: true }, // ✅
    servicioPrestado: { type: Schema.Types.ObjectId, ref: 'ServicioPrestado', required: true }, // ✅
    observaciones: { type: String, required: false, default: '' },
  },
  { versionKey: false },
);
