import Reporte from '../models/Reporte.js';
import { downloadPlanilla } from './scrapingService.js';
import { uploadToDrive } from './driveService.js';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Procesa un reporte individual (Scraping + Local Save + Optional Drive)
 */
export const processSingleReport = async (reporteId) => {
  const reporte = await Reporte.findById(reporteId).populate('contratista').populate('supervisor');
  if (!reporte) throw new Error('Reporte no encontrado');

  let localFilePath = '';
  try {
    console.log(`🤖 [Processor] Iniciando descarga para: ${reporte.contratista.nombres} (${reporte.operadorPago})`);
    
    reporte.status = 'Procesando';
    reporte.intentos += 1;
    await reporte.save();

    // 1. Descargar Planilla via Playwright
    localFilePath = await downloadPlanilla(reporte);
    console.log(`📂 [Processor] Archivo descargado localmente en: ${localFilePath}`);

    // 2. Intentar subir a Drive (Opcional)
    try {
      if (reporte.supervisor.googleTokens) {
        const fileId = await uploadToDrive(localFilePath, {
            supervisor: reporte.supervisor,
            contratista: reporte.contratista,
            operadorPago: reporte.operadorPago,
            periodoPago: reporte.periodoPago
        });
        reporte.archivoUrl = fileId;
        console.log(`☁️ [Processor] Subido a Drive con ID: ${fileId}`);
      } else {
        console.warn(`⚠️ [Processor] El supervisor no tiene Google Drive vinculado. Se conserva solo local.`);
      }
      
      reporte.status = 'Completado';
      reporte.errorLog = null;
      await reporte.save();

    } catch (driveError) {
      console.error(`❌ [Processor] Error en Drive (pero descarga OK):`, driveError.message);
      reporte.status = 'Completado'; // Lo marcamos completado porque la descarga local fue exitosa
      reporte.errorLog = `Drive Error: ${driveError.message}. Archivo guardado en servidor.`;
      await reporte.save();
    }

    // NOTA: NO borramos el archivo local por ahora como pidió el usuario
    // if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

  } catch (error) {
    console.error(`❌ [Processor] Error crítico en reporte ${reporteId}:`, error.message);
    reporte.status = 'Error';
    reporte.errorLog = error.message;
    await reporte.save();
    throw error;
  }
};
