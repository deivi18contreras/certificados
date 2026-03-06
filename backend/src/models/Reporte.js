import mongoose from "mongoose";

const ReporteSchema = new mongoose.Schema(
  {
    numPlanilla: {
      type: Number,
    },
    fechaPago: {
      type: Date,
    },
    valorPagado: {
      type: Number,
    },
    mesPagado: {
      type: String,
      enum: [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ],
      required: [true, "El mes de pago es obligatorio"],
    },
    contratistaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contratista",
      required: [true, "El contratista es obligatorio"],
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: [true, "El supervisor es obligatorio"],
    },
    entidadPagadora: {
      type: String,
      enum: ["asopagos", "soi", "compensar", "aportesEnLinea"],
      required: [true, "La entidad pagadora es obligatoria"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reporte", ReporteSchema);
