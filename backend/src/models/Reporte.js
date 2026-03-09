import mongoose from "mongoose";

const ReporteSchema = new mongoose.Schema(
  {
    contratista: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contratista",
      required: [true, "El contratista es obligatorio"],
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: [true, "El supervisor es obligatorio"],
    },
    operadorPago: {
      type: String,
      enum: ["Aportes en Línea", "Compensar MiPlanilla", "SOI", "Asopagos", "Enlace-APB"],
      required: [true, "El operador de pago es obligatorio"],
    },
    periodoPago: {
      mes: { type: String, required: true },
      anio: { type: String, required: true }
    },
    // Datos específicos que varían por operador
    datosOperador: {
      type: Map,
      of: String
      // Esto permite guardar cualquier campo dinámico como numeroPlanilla, valorPagado, etc.
    },
    status: {
      type: String,
      enum: ["Pendiente", "Procesando", "Completado", "Error"],
      default: "Pendiente"
    },
    intentos: {
      type: Number,
      default: 0
    },
    archivoUrl: {
      type: String // ID o link de Drive
    },
    errorLog: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reporte", ReporteSchema);
