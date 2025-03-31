import { Schema } from "mongoose";

export const FacturacionSchema = new Schema({
  cita: { type: Schema.Types.ObjectId, ref: "cita", required: true },
  cantidad: { type: Number, required: true },
  fechaPago: { type: Date, required: true },
  metodoPago: { type: String, required: true, default: "Efectivo" }
}, { versionKey: false });
