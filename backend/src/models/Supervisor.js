import mongoose from "mongoose";

const SupervisorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del supervisor es obligatorio"],
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    documento: {
      type: Number,
      required: [true, "El número de documento es obligatorio"],
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Supervisor", SupervisorSchema);
