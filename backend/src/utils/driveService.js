import { google } from 'googleapis';
import fs from 'fs';

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const getPreviousMonth = (mes, anio) => {
  const index = meses.indexOf(mes.toLowerCase());
  if (index === -1) return { mes, anio }; // Por si acaso
  
  if (index === 0) {
    return { mes: meses[11], anio: (parseInt(anio) - 1).toString() };
  }
  return { mes: meses[index - 1], anio };
};

const getOrCreateFolder = async (drive, folderName, parentId = null) => {
  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }
  const response = await drive.files.list({ q: query, fields: 'files(id, name)' });
  if (response.data.files.length > 0) return response.data.files[0].id;

  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) folderMetadata.parents = [parentId];
  const folder = await drive.files.create({ resource: folderMetadata, fields: 'id' });
  return folder.data.id;
};

export const uploadToDrive = async (filePath, { supervisor, contratista, operadorPago, periodoPago }) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    if (!supervisor.googleTokens) {
        throw new Error(`El supervisor ${supervisor.nombre} no ha vinculado su cuenta de Google Drive.`);
    }

    oauth2Client.setCredentials(supervisor.googleTokens);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Ajuste de mes atrasado según requerimiento: "si es marzo va en la carpeta de febrero"
    const { mes: mesCarpeta, anio: anioCarpeta } = getPreviousMonth(periodoPago.mes, periodoPago.anio);

    const rootFolderId = await getOrCreateFolder(drive, 'Reporte Entidades');
    const yearFolderId = await getOrCreateFolder(drive, anioCarpeta, rootFolderId);
    const entityFolderId = await getOrCreateFolder(drive, operadorPago, yearFolderId);
    const monthFolderId = await getOrCreateFolder(drive, mesCarpeta, entityFolderId);

    const fileName = `${contratista.nombres} ${contratista.apellidos}`.trim();
    const fileMetadata = { name: `${fileName}.pdf`, parents: [monthFolderId] };
    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({ resource: fileMetadata, media: media, fields: 'id' });
    console.log(`✅ Archivo ${fileName} subido con éxito a Drive en carpeta ${mesCarpeta} ${anioCarpeta}`);
    return file.data.id;
  } catch (error) {
    console.error('❌ Error en uploadToDrive:', error.message);
    throw error;
  }
};
