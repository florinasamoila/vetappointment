import { Schema } from "mongoose";

export const HistorialMedicoSchema = new Schema({
  cita: { type: Schema.Types.ObjectId, ref: "cita", required: true },
  diagnosticos: { type: String, required: true },
  tratamientos: { type: String, required: true },
  observaciones: { type: String, default: null }
}, { versionKey: false });
