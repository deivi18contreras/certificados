import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import admZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOWNLOAD_PATH = path.join(__dirname, '../../temp_downloads');

if (!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
}

// Mapeo de meses a números
const monthToNumber = (monthName) => {
  const months = {
    'enero': '1', 'febrero': '2', 'marzo': '3', 'abril': '4',
    'mayo': '5', 'junio': '6', 'julio': '7', 'agosto': '8',
    'septiembre': '9', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
  };
  return months[monthName.toLowerCase()] || '1';
};

/**
 * @desc    Lógica principal de descarga automatizada según el operador.
 */
export const downloadPlanilla = async (reporte) => {
  const { operadorPago, contratista, periodoPago, datosOperador } = reporte;
  
  let browser;
  try {
    console.log('🔗 Intentando conectar a Chrome existente en puerto 9222...');
    browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
    console.log('✅ Conectado a Chrome existente.');
  } catch (error) {
    console.log('⚠️ No se pudo conectar a Chrome en el puerto 9222. Iniciando nueva instancia visible...');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });
  }

  let page;
  try {
    page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_PATH,
    });

    page.setDefaultNavigationTimeout(60000);

    let filePath = '';
    switch (operadorPago) {
      case 'Aportes en Línea':
        filePath = await scrapeAportesEnLinea(page, { contratista, periodoPago, datosOperador });
        break;
      case 'Compensar MiPlanilla':
        filePath = await scrapeCompensar(page, { contratista, periodoPago, datosOperador });
        break;
      case 'SOI':
        filePath = await scrapeSOI(page, { contratista, periodoPago, datosOperador });
        break;
      case 'Asopagos':
      case 'Enlace-APB':
        filePath = await scrapeEnlaceAPB(page, { contratista, periodoPago, datosOperador });
        break;
      default:
        throw new Error(`Entidad ${operadorPago} no soportada`);
    }

    return filePath;
  } catch (error) {
    console.error(`❌ Error en scraping (${operadorPago}):`, error.message);
    throw error;
  } finally {
    if (page) await page.close();
  }
};

const scrapeAportesEnLinea = async (page, { contratista, periodoPago, datosOperador }) => {
  await page.goto('https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx', { waitUntil: 'networkidle2' });
  
  // Tipo de documento
  const mapDoc = { 'CC': '1', 'CE': '2', 'TI': '5', 'PEP': '10', 'PPT': '11' };
  await page.select('#contenido_ddlTipoIdent', mapDoc[contratista.tipoDocumento] || '1');
  
  // Número de documento
  await page.type('#contenido_tbNumeroIdentificacion', contratista.numeroDocumento);
  
  // Fecha expedición (formato AAAA/MM/DD)
  if (contratista.fechaExpedicion) {
    const fecha = new Date(contratista.fechaExpedicion).toISOString().split('T')[0].replace(/-/g, '/');
    await page.type('#contenido_txtFechaExp', fecha);
  }

  // EPS
  await page.type('#contenido_txtAdmin', contratista.eps || 'SANITAS');

  // Periodo (mismo mes para inicio y fin por defecto)
  const mesNum = monthToNumber(periodoPago.mes);
  await page.select('#contenido_ddlAnioIni', periodoPago.anio);
  await page.select('#contenido_ddlMesIni', mesNum);
  await page.select('#contenido_ddlAnioFin', periodoPago.anio);
  await page.select('#contenido_ddlMesFin', mesNum);

  console.log('Esperando resolución de Captcha si aparece...');
  await page.click('#contenido_btnCalcular');
  
  return await waitForDownload('Aportes');
};

const scrapeCompensar = async (page, { contratista, periodoPago, datosOperador }) => {
  await page.goto('https://www.miplanilla.com/Private/Consultaplanillaindependiente.aspx', { waitUntil: 'networkidle2' });
  
  // El numero de planilla viene en datosOperador (Map)
  const numeroPlanilla = datosOperador instanceof Map ? datosOperador.get('numeroPlanilla') : datosOperador.numeroPlanilla;

  await page.type('#txtNumeroDocumento', contratista.numeroDocumento);
  await page.type('#txtNumeroPlanilla', numeroPlanilla || '');
  
  console.log('Esperando 15 segundos para resolución de Captcha manual...');
  await new Promise(r => setTimeout(r, 15000)); 
  
  await page.click('#btnConsultar');
  return await waitForDownload('Compensar');
};

const scrapeSOI = async (page, { contratista, periodoPago, datosOperador }) => {
  await page.goto('https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do', { waitUntil: 'networkidle2' });
  
  // Datos Aportante (Asumimos el mismo contratista)
  const mapDocSOI = { 'CC': '1', 'CE': '6', 'NIT': '2', 'PEP': '9', 'PPT': '10' };
  await page.select('#tipoDocumentoAportante', mapDocSOI[contratista.tipoDocumento] || '1');
  await page.type('input[name="numeroDocumentoAportante"]', contratista.numeroDocumento);

  // Datos Cotizante
  await page.select('#tipoDocumentoCotizante', mapDocSOI[contratista.tipoDocumento] || '1');
  await page.type('#numeroDocumentoCotizante', contratista.numeroDocumento);

  // EPS mapping (Simplificado para Sanitas y Nueva EPS)
  let epsVal = '128'; // Sanitas por defecto
  if (contratista.eps?.toUpperCase().includes('NUEVA')) epsVal = '171';
  if (contratista.eps?.toUpperCase().includes('SUR')) epsVal = '132';
  if (contratista.eps?.toUpperCase().includes('COMPENSAR')) epsVal = '130';
  
  await page.select('#administradoraSalud', epsVal);

  // Periodo
  const mesNum = monthToNumber(periodoPago.mes);
  await page.select('#periodoLiqSaludMes', mesNum);
  await page.select('#periodoLiqSaludAnnio', periodoPago.anio);

  console.log('🚀 Click en Descargar PDF...');
  await page.click('button.btn-success'); // El botón de descargar
  
  return await waitForDownload('SOI');
};

const scrapeEnlaceAPB = async (page, { contratista, periodoPago, datosOperador }) => {
  await page.goto('https://www.enlace-apb.com/interssi/.plus', { waitUntil: 'networkidle2' });
  // Implementación específica pendiente de más detalles del portal
  return await waitForDownload('Enlace');
};

const waitForDownload = async (prefix) => {
  console.log(`⏳ Esperando archivo para ${prefix} en ${DOWNLOAD_PATH}...`);
  let attempts = 0;
  while (attempts < 30) {
    const files = fs.readdirSync(DOWNLOAD_PATH);
    const downloadFile = files.find(f => f.endsWith('.pdf') || f.endsWith('.zip'));
    
    if (downloadFile) {
      const fullPath = path.join(DOWNLOAD_PATH, downloadFile);
      
      if (downloadFile.endsWith('.zip')) {
        console.log('📦 Descomprimiendo ZIP...');
        const zip = new admZip(fullPath);
        const zipEntries = zip.getEntries();
        const pdfEntry = zipEntries.find(entry => entry.entryName.endsWith('.pdf'));
        
        if (pdfEntry) {
          const newPdfName = `${prefix}_${Date.now()}.pdf`;
          const newPath = path.join(DOWNLOAD_PATH, newPdfName);
          fs.writeFileSync(newPath, pdfEntry.getData());
          fs.unlinkSync(fullPath); 
          return newPath;
        }
      }

      const newPdfName = `${prefix}_${Date.now()}.pdf`;
      const newPath = path.join(DOWNLOAD_PATH, newPdfName);
      fs.renameSync(fullPath, newPath);
      return newPath;
    }
    await new Promise(r => setTimeout(r, 2000));
    attempts++;
  }
  throw new Error('No se detectó la descarga del certificado.');
};
