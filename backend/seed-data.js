import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contratista from './src/models/Contratista.js';
import Supervisor from './src/models/Supervisor.js';
import Reporte from './src/models/Reporte.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/certificados_sena';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB para seeding...');

    await Reporte.deleteMany({});
    await Contratista.deleteMany({});

    let supervisor = await Supervisor.findOne({ email: 'supervisor@sena.edu.co' });
    if (!supervisor) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('sena1234', salt);
      supervisor = await Supervisor.create({
        nombre: 'Miguel Angel Dulcey',
        email: 'supervisor@sena.edu.co',
        password: hashedPassword,
        documento: '12345678',
      });
    }

    // 1. Miguel Angel Dulcey -> SANITAS para Aportes
    const miguel = await Contratista.create({
      nombres: 'MIGUEL ANGEL',
      apellidos: 'DULCEY',
      tipoDocumento: 'CC',
      numeroDocumento: '91075655',
      fechaExpedicion: new Date('1994-10-31'),
      eps: 'SANITAS'
    });

    // 2. Monica Yaneth Barrera -> Compensar
    const monica = await Contratista.create({
      nombres: 'MONICA YANETH',
      apellidos: 'BARRERA BALLESTEROS',
      tipoDocumento: 'CC',
      numeroDocumento: '37898093',
      fechaExpedicion: new Date('2000-01-01'),
      eps: 'SANITAS'
    });

    const reportesData = [
      {
        contratista: monica._id,
        supervisor: supervisor._id,
        operadorPago: 'Compensar MiPlanilla',
        periodoPago: { mes: 'enero', anio: '2026' },
        datosOperador: {
          numeroPlanilla: '50885037',
          valorPagado: '590900',
          fechaPago: '2026-02-13' // 13 de Febrero
        },
        status: 'Pendiente'
      },
      {
        contratista: miguel._id,
        supervisor: supervisor._id,
        operadorPago: 'Aportes en Línea',
        periodoPago: { mes: 'enero', anio: '2026' },
        datosOperador: {
          numeroPlanilla: '0', 
          valorPagado: '0',
          fechaPago: '2026-01-01'
        },
        status: 'Pendiente'
      }
    ];

    await Reporte.insertMany(reportesData);
    console.log(`✅ Datos preparados: Monica (Compensar - 13 Feb) y Miguel (Aportes - Sanitas).`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  }
};

seedData();
