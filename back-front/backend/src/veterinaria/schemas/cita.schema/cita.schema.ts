import { Schema } from "mongoose";

export const CitaSchema = new Schema({
  fechaHora: { type: Date, required: true },
  motivo: { type: String, required: true },
  estado: { 
    type: String, 
    required: true, 
    enum: ["Programada", "Confirmada", "Cancelada", "Completada"],
    default: "Programada"
  },
  cliente: { type: Schema.Types.ObjectId, ref: "cliente", required: true },
  mascota: { type: Schema.Types.ObjectId, ref: "mascota", required: true },
  veterinario: { type: Schema.Types.ObjectId, ref: "veterinario", required: true },
  servicioPrestado: { type: Schema.Types.ObjectId, ref: "servicioPrestado", required: true }
}, { versionKey: false });

