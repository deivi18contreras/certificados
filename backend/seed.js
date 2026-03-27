import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Contratista from './src/models/Contratista.js';
import Supervisor from './src/models/Supervisor.js';
import Reporte from './src/models/Reporte.js';

dotenv.config();

const supervisorsData = [
  {
    nombre: 'Ana García',
    email: 'ana.garcia@sena.edu.co',
    password: 'password123',
    documento: '10203040'
  },
  {
    nombre: 'Carlos López',
    email: 'carlos.lopez@sena.edu.co',
    password: 'password123',
    documento: '50607080'
  },
  {
    nombre: 'Elena Rodríguez',
    email: 'elena.rodriguez@sena.edu.co',
    password: 'password123',
    documento: '90101112'
  }
];

const contratistasData = [
  {
    nombres: 'MONICA YANETH',
    apellidos: 'BARRERA BALLESTEROS',
    tipoDocumento: 'CC',
    numeroDocumento: '37898093',
    fechaExpedicion: new Date('2000-01-01'),
    eps: 'SANITAS'
  },
  {
    nombres: 'MIGUEL ANGEL',
    apellidos: 'DULCEY',
    tipoDocumento: 'CC',
    numeroDocumento: '91075655',
    fechaExpedicion: new Date('1994-10-31'),
    eps: 'SANITAS'
  },
  {
    nombres: 'LUIS EDUARDO',
    apellidos: 'GONZALEZ SANCHEZ',
    tipoDocumento: 'CC',
    numeroDocumento: '79794241',
    fechaExpedicion: new Date('1990-01-01'), // Fecha estimada si no se provee
    eps: 'NUEVA EPS'
  },
  {
    nombres: 'NELSON FABIAN',
    apellidos: 'DUARTE PEÑALOZA',
    tipoDocumento: 'CC',
    numeroDocumento: '1100952854',
    fechaExpedicion: new Date('1990-01-01'), // Fecha estimada
    eps: 'SANITAS'
  }
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/certificados_sena';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB para seeding consolidado...');

    // Limpiar base de datos
    await Reporte.deleteMany({});
    await Contratista.deleteMany({});
    await Supervisor.deleteMany({});
    console.log('🗑️ Base de datos limpiada.');

    // Crear Supervisores
    const createdSupervisors = [];
    for (const data of supervisorsData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const supervisor = await Supervisor.create({
        ...data,
        password: hashedPassword
      });
      createdSupervisors.push(supervisor);
    }
    console.log(`✅ ${createdSupervisors.length} Supervisores creados.`);

    // Crear Contratistas
    const createdContratistas = [];
    for (const cData of contratistasData) {
      const contratista = await Contratista.create(cData);
      createdContratistas.push(contratista);
    }
    const monica = createdContratistas[0];
    const miguel = createdContratistas[1];
    const luis = createdContratistas[2];
    const nelson = createdContratistas[3];
    console.log(`✅ ${createdContratistas.length} Contratistas creados.`);

    // Crear Reportes (asignados al primer supervisor: Ana García)
    const primarySupervisorId = createdSupervisors[0]._id;

    const reportesData = [
      {
        contratista: monica._id,
        supervisor: primarySupervisorId,
        operadorPago: 'Compensar MiPlanilla',
        periodoPago: { mes: 'enero', anio: '2026' },
        datosOperador: {
          numeroPlanilla: '50885037',
          valorPagado: '590900',
          fechaPago: '2026-02-13'
        },
        status: 'Pendiente'
      },
      {
        contratista: miguel._id,
        supervisor: primarySupervisorId,
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
    console.log('✅ Reportes de prueba insertados.');

    console.log('🚀 PROCESO DE SEEDING COMPLETADO EXITOSAMENTE.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding consolidado:', error);
    process.exit(1);
  }
};

seed();
