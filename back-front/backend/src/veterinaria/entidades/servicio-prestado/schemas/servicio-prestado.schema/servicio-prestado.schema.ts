import { Schema } from "mongoose";

export const ServicioPrestadoSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  costo: { type: Number, required: true }
}, { versionKey: false });
