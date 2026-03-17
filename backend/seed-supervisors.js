import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Supervisor from './src/models/Supervisor.js';
import bcrypt from 'bcryptjs';

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

const seedSupervisors = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/certificados';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB para seeding de supervisores...');

    for (const data of supervisorsData) {
      const existing = await Supervisor.findOne({ email: data.email });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        
        await Supervisor.create({
          ...data,
          password: hashedPassword
        });
        console.log(`✅ Supervisor ${data.nombre} creado.`);
      } else {
        console.log(`ℹ️ Supervisor ${data.nombre} ya existe.`);
      }
    }

    console.log('🚀 Seeding de supervisores completado.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  }
};

seedSupervisors();
