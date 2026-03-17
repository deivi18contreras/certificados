import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import admZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const DOWNLOAD_PATH = path.resolve(__dirname, '../../../temp_downloads');

if (!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
}

export const monthToNumber = (monthName) => {
  const months = {
    'enero': '1', 'febrero': '2', 'marzo': '3', 'abril': '4',
    'mayo': '5', 'junio': '6', 'julio': '7', 'agosto': '8',
    'septiembre': '9', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
  };
  return months[monthName.toLowerCase()] || '1';
};

export const handleDownload = async (download, prefix) => {
  const suggestedName = download.suggestedFilename();
  const tempPath = path.join(DOWNLOAD_PATH, suggestedName);
  await download.saveAs(tempPath);

  if (suggestedName.toLowerCase().endsWith('.zip')) {
    const zip = new admZip(tempPath);
    const zipEntries = zip.getEntries();
    const pdfEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.pdf'));
    
    if (pdfEntry) {
      const finalName = `${prefix}_${Date.now()}.pdf`;
      const finalPath = path.join(DOWNLOAD_PATH, finalName);
      fs.writeFileSync(finalPath, pdfEntry.getData());
      fs.unlinkSync(tempPath);
      return finalPath;
    } else {
      throw new Error('No se encontró PDF en el ZIP.');
    }
  } else {
    const finalName = `${prefix}_${Date.now()}.pdf`;
    const finalPath = path.join(DOWNLOAD_PATH, finalName);
    fs.renameSync(tempPath, finalPath);
    return finalPath;
  }
};
