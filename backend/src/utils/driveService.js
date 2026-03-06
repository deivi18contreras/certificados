import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Configuración de la API de Google Drive
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  process.env.GOOGLE_DRIVE_REDIRECT_URI
);

/**
 * @desc    Obtener o crear una carpeta en Drive
 * @param   {string} folderName - Nombre de la carpeta
 * @param   {string} parentId - ID de la carpeta padre (opcional)
 * @returns {string} - ID de la carpeta
 */
export const getOrCreateFolder = async (folderName, parentId = null) => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
  });

  if (response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentId) {
    folderMetadata.parents = [parentId];
  }

  const folder = await drive.files.create({
    resource: folderMetadata,
    fields: 'id',
  });

  return folder.data.id;
};

/**
 * @desc    Subir un archivo a la estructura de carpetas de un supervisor
 * @param   {string} filePath - Ruta local del archivo
 * @param   {string} fileName - Nombre del archivo en Drive
 * @param   {object} folderStructure - { year, month, contractorName }
 */
export const uploadPlanillaToDrive = async (filePath, fileName, { year, month, contractorName }) => {
  try {
    // 1. Obtener o crear carpeta raíz "reporte entidades"
    const rootFolderId = await getOrCreateFolder('reporte entidades');

    // 2. Obtener o crear carpeta del año
    const yearFolderId = await getOrCreateFolder(year.toString(), rootFolderId);

    // 3. Obtener o crear carpeta del mes
    const monthFolderId = await getOrCreateFolder(month, yearFolderId);

    // 4. Obtener o crear carpeta del contratista
    const contractorFolderId = await getOrCreateFolder(contractorName, monthFolderId);

    // 5. Subir el archivo
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const fileMetadata = {
      name: fileName,
      parents: [contractorFolderId],
    };
    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    return file.data.id;
  } catch (error) {
    console.error('*** Error al subir archivo a Drive:', error.message);
    throw error;
  }
};
