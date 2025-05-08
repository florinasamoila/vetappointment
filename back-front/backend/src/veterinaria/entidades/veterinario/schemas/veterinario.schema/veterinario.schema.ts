import { Schema } from "mongoose";

export const VeterinarioSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  especialidad: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  citas: [{ type: Schema.Types.ObjectId, ref: "cita", default: [] }]
}, { versionKey: false });
