import cron from 'node-cron';
import Reporte from '../models/Reporte.js';
<<<<<<< HEAD
import { downloadPlanilla } from './scrapingService.js';
import { uploadToDrive } from './driveService.js';
import fs from 'fs';
=======
import { processSingleReport } from './reportProcessor.js';
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c

/**
 * @desc    Procesa los reportes pendientes uno por uno.
 */
export const processPendingReports = async () => {
  console.log('🤖 [Robot] Revisando reportes pendientes...');
  
  try {
    // Buscar reportes con status 'Pendiente' o 'Error' con menos de 3 intentos
<<<<<<< HEAD
    const pendingReports = await Reporte.find({
      status: { $in: ['Pendiente', 'Error'] },
      intentos: { $lt: 3 }
    }).populate('contratista').populate('supervisor');
=======
    // Evitamos los que ya están 'Procesando' para no duplicar Playwright
    const pendingReports = await Reporte.find({
      status: { $in: ['Pendiente', 'Error'] },
      intentos: { $lt: 3 }
    });
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c

    if (pendingReports.length === 0) {
      console.log('💤 No hay reportes pendientes.');
      return;
    }

    console.log(`📋 Encontrados ${pendingReports.length} reportes para procesar.`);

    for (const reporte of pendingReports) {
      try {
<<<<<<< HEAD
        console.log(`▶️ Procesando: ${reporte.contratista.nombres} (${reporte.operadorPago})`);
        
        // Marcar como procesando e incrementar intentos
        reporte.status = 'Procesando';
        reporte.intentos += 1;
        await reporte.save();

        // 1. Descargar Planilla (Scraping)
        const localFilePath = await downloadPlanilla(reporte);

        // 2. Subir a Drive
        const fileId = await uploadToDrive(localFilePath, {
            supervisor: reporte.supervisor,
            contratista: reporte.contratista,
            operadorPago: reporte.operadorPago,
            periodoPago: reporte.periodoPago
        });

        // 3. Actualizar Reporte
        reporte.status = 'Completado';
        reporte.archivoUrl = fileId; 
        reporte.errorLog = null;
        await reporte.save();

        // 4. Limpiar archivo local temporal
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.log(`✅ Finalizado con éxito: ${reporte.contratista.nombres}`);

      } catch (error) {
        console.error(`❌ Error procesando reporte ${reporte._id}:`, error.message);
        
        reporte.status = 'Error';
        reporte.errorLog = error.message;
        await reporte.save();
=======
        // Usamos la utilidad centralizada
        await processSingleReport(reporte._id);
      } catch (error) {
        // El error ya se maneja y guarda dentro de processSingleReport
        console.error(`❌ Fallo en el robot para reporte ${reporte._id}:`, error.message);
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
      }
    }

  } catch (error) {
    console.error('*** Error crítico en ScraperCron:', error.message);
  }
};

/**
 * @desc    Inicia el Cron Job cada 5 minutos
 */
export const initCron = () => {
  console.log('🚀 Sistema de Cron iniciado (Intervalo: 5 minutos)');
  
<<<<<<< HEAD
  // '*/5 * * * *' -> Cada 5 minutos
=======
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
  cron.schedule('*/5 * * * *', () => {
    processPendingReports();
  });

<<<<<<< HEAD
  // Ejecución inicial diferida para asegurar que la DB esté lista
=======
  // Ejecución inicial diferida
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
  setTimeout(processPendingReports, 5000);
};
