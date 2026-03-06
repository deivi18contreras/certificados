import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/certificados_sena';
    await mongoose.connect(mongoUri);
    console.log('--- Conexión exitosa a MongoDB ---');
  } catch (error) {
    console.error('*** Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default dbConnect;
