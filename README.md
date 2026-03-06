# 📘 Sistema de Registro de Planillas de Pago

Este proyecto es un **mini software** diseñado para registrar y gestionar planillas de pago relacionadas con pensión, salud y otros aportes obligatorios.  
Su objetivo es facilitar el control administrativo de contratistas y supervisores, permitiendo almacenar información clave y generar reportes de pagos realizados.  

👉 Los **mockups del sistema** se encuentran disponibles aquí:  
[Mockups del proyecto](https://stitch.withgoogle.com/projects/2060183493876786157)

---

## 🚀 Características principales

- Registro de contratistas con datos personales y de EPS.  
- Administración de supervisores con credenciales seguras.  
- Creación y consulta de reportes de planillas de pago.  
- Asociación de reportes con contratistas y supervisores.  
- Control de entidades pagadoras (Asopagos, SOI, Compensar, Aportes en Línea).  

---

## 🛠️ Tecnologías utilizadas

- **Backend:** Node.js + Express  
- **Base de datos:** MongoDB Atlas (Mongoose ODM)  
- **Frontend:** Vue.js (mockups disponibles)  
- **Infraestructura:** Cloud / API REST  

---

## 📂 Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/usuario/proyecto.git
```

## modelos
Contratista
```js
import mongoose from "mongoose";

const Contratista = new mongoose.Schema(
  {
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    tipoDoc: { type: String, required: true },
    numeroDoc: { type: Number, required: true },
    eps: { type: String, required: true },
    expCedula: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Contratista", Contratista);
```

Supervisor

```js

import mongoose from "mongoose";

const Supervisor = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    documento: { type: Number, unique: true },
  },
  { timestamps: true },
);

export default mongoose.model("Supervisor", Supervisor);
```

Reporte

```js
import mongoose from "mongoose";

const Reporte = new mongoose.Schema(
  {
    numPlanilla: { type: Number },
    fechaPago: { type: Date },
    valorPagado: { type: Number },
    mesPagado: {
      type: String,
      enum: [
        "enero","febrero","marzo","abril","mayo","junio",
        "julio","agosto","septiembre","octubre","noviembre","diciembre",
      ],
      required: true,
    },
    contratistaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contratista",
      required: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true,
    },
    entidadPagadora: {
      type: String,
      enum: ["asopagos", "soi", "compensar", "aportesEnLinea"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Reporte", Reporte);

```
