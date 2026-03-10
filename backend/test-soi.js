import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Supervisor from './src/models/Supervisor.js';
import Contratista from './src/models/Contratista.js';
import Reporte from './src/models/Reporte.js';
import dbConnect from './src/config/dataBase.js';
import { downloadPlanilla } from './src/utils/scrapingService.js';

dotenv.config();

const runSOITest = async () => {
    try {
        await dbConnect();
        console.log('🧪 Iniciando Prueba de SOI con Playwright (Visible)...');

        // 1. Buscar o crear el supervisor
        let supervisor = await Supervisor.findOne({ email: 'ana.garcia@sena.edu.co' });
        if (!supervisor) {
            console.log('❌ No se encontró el supervisor ana.garcia@sena.edu.co. Por favor corre el seed primero.');
            process.exit(1);
        }

        // 2. Crear o actualizar contratista de prueba
        let contratista = await Contratista.findOne({ numeroDocumento: '79794241' });
        if (!contratista) {
            contratista = await Contratista.create({
                nombres: 'LUIS EDUARDO',
                apellidos: 'GONZALEZ SANCHEZ',
                tipoDocumento: 'CC',
                numeroDocumento: '79794241',
                fechaExpedicion: new Date('2000-01-01'),
                eps: 'NUEVA EPS'
            });
            console.log('✅ Contratista creado para la prueba.');
        } else {
            contratista.eps = 'NUEVA EPS';
            await contratista.save();
            console.log('✅ Contratista existente actualizado.');
        }

        // 3. Crear el reporte para SOI
        const reporte = {
            contratista: contratista,
            supervisor: supervisor,
            operadorPago: 'SOI',
            periodoPago: { mes: 'enero', anio: '2026' },
            datosOperador: {
                numeroPlanilla: '6001245996' // Ejemplo de planilla válida para este usuario si se requiere
            }
        };

        // 4. Ejecutar el robot
        console.log('🚀 Lanzando Playwright...');
        const filePath = await downloadPlanilla(reporte);
        
        console.log('\n--- ✅ PRUEBA EXITOSA ---');
        console.log(`Archivo descargado en: ${filePath}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la prueba de SOI:', error.message);
        process.exit(1);
    }
};

runSOITest();
