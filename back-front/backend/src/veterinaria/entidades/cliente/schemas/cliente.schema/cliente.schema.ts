import { Schema } from "mongoose";

export const ClienteSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  mascotas: [{ type: Schema.Types.ObjectId, ref: "Mascota", required: false, default: [] }]
}, { versionKey: false });
