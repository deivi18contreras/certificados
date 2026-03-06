import mongoose from "mongoose";

const ContratistaSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      required: [true, "El nombre del contratista es obligatorio"],
    },
    apellidos: {
      type: String,
      required: [true, "El apellido del contratista es obligatorio"],
    },
    tipoDoc: {
      type: String,
      required: [true, "El tipo de documento es obligatorio"],
    },
    numeroDoc: {
      type: Number,
      required: [true, "El número de documento es obligatorio"],
    },
    eps: {
      type: String,
      required: [true, "La EPS es obligatoria"],
    },
    expCedula: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contratista", ContratistaSchema);
