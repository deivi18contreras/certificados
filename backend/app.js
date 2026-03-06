import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import dbConnect from './src/config/dataBase.js';
import supervisorRoutes from './src/routes/supervisorRoutes.js';
import contratistaRoutes from './src/routes/contratistaRoutes.js';
import reporteRoutes from './src/routes/reporteRoutes.js';
import errorMiddleware from './src/middlewares/errorMiddleware.js';

// Carga de variables de entorno
dotenv.config();

// Inicialización de la app
const app = express();

// Conectar a la base de datos
dbConnect();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/supervisors', supervisorRoutes);
app.use('/api/contratistas', contratistaRoutes);
app.use('/api/reportes', reporteRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.json({
    name: 'Sistema Automatizado de Planillas SENA',
    version: '1.0.0',
    status: 'online'
  });
});

// Middleware de manejo de errores (debe ir después de las rutas)
app.use(errorMiddleware);

// Definición del puerto y arranque del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`--- Servidor corriendo en el puerto: ${PORT} ---`);
});

export default app;
