import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import admZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nueva ruta base para descargas: backend/src/descargas
export const BASE_DOWNLOAD_PATH = path.resolve(__dirname, '../descargas');

/**
 * @desc Retorna la ruta de descarga específica según el operador
 */
export const getOperatorPath = (prefix) => {
  const folderMap = {
    'SOI': 'soi',
    'Aportes': 'aportes',
    'MiPlanilla': 'miplanilla',
    'Compensar': 'miplanilla',
    'Asopagos': 'asopagos'
  };
  
  const folder = folderMap[prefix] || 'otros';
  const targetPath = path.join(BASE_DOWNLOAD_PATH, folder);
  
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  
  return targetPath;
};

export const monthToNumber = (monthName) => {
  const months = {
    'enero': '1', 'febrero': '2', 'marzo': '3', 'abril': '4',
    'mayo': '5', 'junio': '6', 'julio': '7', 'agosto': '8',
    'septiembre': '9', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
  };
  return months[monthName.toLowerCase()] || '1';
};

/**
 * @desc Manejador de descargas dinámico por carpeta
 */
export const handleDownload = async (download, prefix) => {
  const suggestedName = download.suggestedFilename();
  const operatorPath = getOperatorPath(prefix);
  const tempPath = path.join(operatorPath, suggestedName);
  
  await download.saveAs(tempPath);

  if (suggestedName.toLowerCase().endsWith('.zip')) {
    const zip = new admZip(tempPath);
    const zipEntries = zip.getEntries();
    const pdfEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.pdf'));
    
    if (pdfEntry) {
      const finalName = `${prefix}_${Date.now()}.pdf`;
      const finalPath = path.join(operatorPath, finalName);
      fs.writeFileSync(finalPath, pdfEntry.getData());
      fs.unlinkSync(tempPath);
      console.log(`✅ [${prefix}] PDF extraído en: ${finalPath}`);
      return finalPath;
    } else {
      throw new Error('No se encontró PDF en el ZIP.');
    }
  } else {
    const finalName = `${prefix}_${Date.now()}.pdf`;
    const finalPath = path.join(operatorPath, finalName);
    fs.renameSync(tempPath, finalPath);
    console.log(`✅ [${prefix}] PDF guardado en: ${finalPath}`);
    return finalPath;
  }
};
