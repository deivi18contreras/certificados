import cron from 'node-cron';
import Reporte from '../models/Reporte.js';
import { processSingleReport } from './reportProcessor.js';

/**
 * @desc    Procesa los reportes pendientes uno por uno.
 */
export const processPendingReports = async () => {
  console.log('🤖 [Robot] Revisando reportes pendientes...');
  
  try {
    // Buscar reportes con status 'Pendiente' o 'Error' con menos de 3 intentos
    // Evitamos los que ya están 'Procesando' para no duplicar Playwright
    const pendingReports = await Reporte.find({
      status: { $in: ['Pendiente', 'Error'] },
      intentos: { $lt: 3 }
    });

    if (pendingReports.length === 0) {
      console.log('💤 No hay reportes pendientes.');
      return;
    }

    console.log(`📋 Encontrados ${pendingReports.length} reportes para procesar.`);

    for (const reporte of pendingReports) {
      try {
        // Usamos la utilidad centralizada
        await processSingleReport(reporte._id);
      } catch (error) {
        // El error ya se maneja y guarda dentro de processSingleReport
        console.error(`❌ Fallo en el robot para reporte ${reporte._id}:`, error.message);
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
  
  cron.schedule('*/5 * * * *', () => {
    processPendingReports();
  });

  // Ejecución inicial diferida
  setTimeout(processPendingReports, 5000);
};
