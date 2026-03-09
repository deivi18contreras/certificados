import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contratista from './src/models/Contratista.js';
import Supervisor from './src/models/Supervisor.js';
import Reporte from './src/models/Reporte.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/certificados';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB para seeding...');

    // Limpiar colecciones (Opcional, ten cuidado)
    // await Contratista.deleteMany({});
    // await Reporte.deleteMany({});
    // await Supervisor.deleteMany({});

    // 1. Crear Supervisor de ejemplo si no existe
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
      console.log('✅ Supervisor creado');
    }

    // 2. Crear Contratistas basados en el PDF
    const contratistasData = [
      {
        nombres: 'YURLEY TATIANA',
        apellidos: 'BERNAL PORRAS',
        tipoDocumento: 'CC',
        numeroDocumento: '1100971354',
        fechaExpedicion: new Date('2000-01-01'), // Fecha ficticia
        eps: 'SANITAS'
      },
      {
        nombres: 'MONICA YANETH',
        apellidos: 'BARRERA BALLESTEROS',
        tipoDocumento: 'CC',
        numeroDocumento: '37898093',
        fechaExpedicion: new Date('2000-01-01'),
        eps: 'SANITAS'
      },
      {
        nombres: 'LUIS EDUARDO',
        apellidos: 'GONZALEZ SANCHEZ',
        tipoDocumento: 'CC',
        numeroDocumento: '79794241',
        fechaExpedicion: new Date('2000-01-01'),
        eps: 'NUEVA EPS'
      }
    ];

    const savedContratistas = [];
    for (const data of contratistasData) {
      let c = await Contratista.findOne({ numeroDocumento: data.numeroDocumento });
      if (!c) {
        c = await Contratista.create(data);
        console.log(`✅ Contratista ${data.nombres} creado`);
      }
      savedContratistas.push(c);
    }

    // 3. Crear Reportes basados en el PDF
    const reportesData = [
      {
        contratista: savedContratistas[0]._id, // Yurley
        supervisor: supervisor._id,
        operadorPago: 'SOI',
        periodoPago: { mes: 'enero', anio: '2026' },
        datosOperador: {
          numeroPlanilla: '6001194878',
          valorPagado: '541800'
        },
        status: 'Pendiente'
      },
      {
        contratista: savedContratistas[1]._id, // Monica
        supervisor: supervisor._id,
        operadorPago: 'Compensar MiPlanilla',
        periodoPago: { mes: 'enero', anio: '2026' },
        datosOperador: {
          numeroPlanilla: '50885037',
          valorPagado: '590900'
        },
        status: 'Pendiente'
      },
      {
        contratista: savedContratistas[2]._id, // Luis
        supervisor: supervisor._id,
        operadorPago: 'SOI',
        periodoPago: { mes: 'enero', anio: '2026' },
        datosOperador: {
          numeroPlanilla: '6001245996',
          valorPagado: '552800'
        },
        status: 'Pendiente'
      }
    ];

    for (const data of reportesData) {
      const r = await Reporte.findOne({ 
        contratista: data.contratista, 
        'periodoPago.mes': data.periodoPago.mes,
        'periodoPago.anio': data.periodoPago.anio 
      });
      if (!r) {
        await Reporte.create(data);
        console.log(`✅ Reporte para contratista ID ${data.contratista} creado`);
      }
    }

    console.log('🚀 Seeding completado con éxito');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  }
};

seedData();
