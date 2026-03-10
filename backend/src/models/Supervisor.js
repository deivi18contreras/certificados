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
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    documento: {
      type: String,
      required: [true, "El documento es obligatorio"],
      unique: true,
    },
    googleTokens: {
      type: Object, // Almacena access_token, refresh_token, etc.
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Supervisor", SupervisorSchema);
