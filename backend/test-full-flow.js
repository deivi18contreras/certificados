import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Supervisor from './src/models/Supervisor.js';
import Contratista from './src/models/Contratista.js';
import Reporte from './src/models/Reporte.js';
import dbConnect from './src/config/dataBase.js';
import { downloadPlanilla } from './src/utils/scrapingService.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const runTest = async () => {
    try {
        await dbConnect();
        console.log('🧪 Iniciando Prueba de Flujo Real (Robot Scraping)...');

        // 1. Limpiar datos de prueba anteriores
        await Reporte.deleteMany({ 'datosOperador.numeroPlanilla': 'TEST-123' });
        await Contratista.deleteOne({ numeroDocumento: '123456789' });

        // 2. Crear un Supervisor de prueba (si no existe)
        let supervisor = await Supervisor.findOne({ email: 'test_supervisor@sena.edu.co' });
        if (!supervisor) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);
            supervisor = await Supervisor.create({
                nombre: 'Supervisor de Prueba',
                email: 'test_supervisor@sena.edu.co',
                password: hashedPassword,
                documento: '999999'
            });
            console.log('✅ Supervisor de prueba creado.');
        }

        // 3. Crear un Contratista de prueba
        const contratista = await Contratista.create({
            nombres: 'Prueba',
            apellidos: 'Robot',
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            fechaExpedicion: new Date('1990-01-01'),
            eps: 'Sura'
        });
        console.log('✅ Contratista de prueba creado.');

        // 4. Crear un Reporte de prueba para SOI
        const reporte = await Reporte.create({
            contratista: contratista._id,
            supervisor: supervisor._id,
            operadorPago: 'SOI',
            periodoPago: { mes: '01', anio: '2026' },
            datosOperador: {
                numeroPlanilla: 'TEST-123',
                eps: 'Sura'
            },
            status: 'Procesando'
        });
        console.log('✅ Reporte de prueba creado (SOI).');

        // 5. Ejecutar el Scraper (Prueba de descarga)
        console.log('🚀 Iniciando Scraper de SOI para el contratista...');
        
        // Pasamos los datos que espera el scraper
        const dataForScraper = {
            entidadPagadora: reporte.operadorPago,
            contratista: contratista,
            numPlanilla: reporte.datosOperador.numeroPlanilla,
            mesPagado: reporte.periodoPago.mes,
            anioPagado: reporte.periodoPago.anio
        };

        const filePath = await downloadPlanilla(dataForScraper);
        console.log(`✅ Scraper finalizado. Archivo descargado en: ${filePath}`);

        console.log('\n--- PRUEBA COMPLETADA (FASE SCRAPING) ---');
        console.log('Nota: Para probar la subida a Drive real, el supervisor debe haber vinculado su cuenta mediante el dashboard del frontend.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        process.exit(1);
    }
};

runTest();
