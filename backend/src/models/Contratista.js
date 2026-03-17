import mongoose from "mongoose";

const ContratistaSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      required: [true, "El nombre del contratista es obligatorio"],
      trim: true
    },
    apellidos: {
      type: String,
      required: [true, "El apellido del contratista es obligatorio"],
      trim: true
    },
    tipoDocumento: {
      type: String,
      required: [true, "El tipo de documento es obligatorio"],
      enum: ["CC", "CE", "PEP", "PPT", "NIT"]
    },
    numeroDocumento: {
      type: String,
      required: [true, "El número de documento es obligatorio"],
      unique: true,
      trim: true
    },
    fechaExpedicion: {
      type: Date,
      required: false
    },
    eps: {
      type: String,
      required: [true, "La EPS es obligatoria"],
      trim: true
    },
    // Campos adicionales que pueden ser necesarios para algunos operadores
    tipoCotizante: {
      type: String,
      default: "Independiente"
    },
    tipoCertificado: {
      type: String,
      default: "Aportes"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Contratista", ContratistaSchema);
