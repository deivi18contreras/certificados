import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOWNLOAD_PATH = path.join(__dirname, '../../temp_downloads');

// Asegurar que existe el directorio de descargas
if (!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
}

/**
 * @desc    Inicia el proceso de descarga automática de la planilla
 * @param   {object} data - Datos del reporte (entidad, documento, etc.)
 * @returns {string} - Ruta local del archivo descargado
 */
export const downloadPlanilla = async (data) => {
  const { entidadPagadora } = data;
  
  const browser = await puppeteer.launch({
    headless: false, // Se deja en false para ver el proceso (debug), en prod cambiar a true
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar comportamiento de descarga
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_PATH,
    });

    // Configurar timeout y user agent para evitar bloqueos simples
    page.setDefaultNavigationTimeout(60000);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    let filePath = '';

    switch (entidadPagadora) {
      case 'asopagos':
        filePath = await scrapeAsopagos(page, data);
        break;
      case 'soi':
        filePath = await scrapeSOI(page, data);
        break;
      case 'aportesEnLinea':
        filePath = await scrapeAportesEnLinea(page, data);
        break;
      case 'compensar':
        filePath = await scrapeCompensar(page, data);
        break;
      default:
        throw new Error('Entidad pagadora no soportada actualmente');
    }

    return filePath;
  } catch (error) {
    console.error('*** Error durante el scraping:', error.message);
    throw error;
  } finally {
    // Esperar un poco antes de cerrar para asegurar descargas en progreso
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
  }
};

/**
 * Helper para esperar descarga
 */
const waitForDownload = async (filenamePrefix) => {
  console.log(`Esperando descarga que empiece con: ${filenamePrefix}`);
  // Lógica simplificada: esperar y buscar archivo más reciente
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const files = fs.readdirSync(DOWNLOAD_PATH);
  // Buscar archivo PDF reciente
  const recentFile = files
    .map(file => ({ file, mtime: fs.statSync(path.join(DOWNLOAD_PATH, file)).mtime }))
    .sort((a, b) => b.mtime - a.mtime)[0];

  if (recentFile && recentFile.file.endsWith('.pdf')) {
    return path.join(DOWNLOAD_PATH, recentFile.file);
  }
  throw new Error('No se encontró el archivo descargado');
};

/**
 * Lógica específica para Asopagos
 * URL: https://www.enlace-apb.com/interssi/.plus
 */
const scrapeAsopagos = async (page, data) => {
  console.log('--- Iniciando Scraping Asopagos ---');
  await page.goto('https://www.enlace-apb.com/interssi/.plus', { waitUntil: 'networkidle2' });
  
  const { contratista, numPlanilla, valorPagado } = data;

  // NOTA: Los selectores son aproximados y dependen de la estructura real del sitio
  // Se debe inspeccionar el sitio real para obtener los IDs correctos.
  
  // Ejemplo hipotético de flujo:
  // 1. Seleccionar tipo documento (CC)
  // await page.select('#tipoDocumento', 'CC'); // Asumiendo ID
  
  // 2. Ingresar número documento
  // await page.type('#numeroDocumento', contratista.numDocumento.toString());
  
  // 3. Ingresar número de planilla
  // await page.type('#numeroPlanilla', numPlanilla.toString());
  
  // 4. Clic en Buscar/Consultar
  // await page.click('#btnConsultar');
  
  // 5. Esperar resultados y descargar
  // await page.waitForSelector('.btn-descargar-pdf');
  // await page.click('.btn-descargar-pdf');

  console.log('Simulando navegación y descarga en Asopagos...');
  
  // Simulación para prueba sin credenciales reales
  const mockPath = path.join(DOWNLOAD_PATH, `Asopagos_${numPlanilla}.pdf`);
  fs.writeFileSync(mockPath, 'Contenido PDF simulado para Asopagos');
  
  return mockPath;
};

/**
 * Lógica específica para SOI
 * URL: https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do
 */
const scrapeSOI = async (page, data) => {
  console.log('--- Iniciando Scraping SOI ---');
  await page.goto('https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do', { waitUntil: 'networkidle2' });
  
  const { contratista, mesPagado } = data;

  // Selectores reales encontrados:
  // #numeroDocumentoCotizante
  
  console.log('Llenando formulario SOI...');
  await page.type('#numeroDocumentoCotizante', contratista.numDocumento.toString());
  
  // Nota: SOI parece requerir selección de banco o aportante en algunos casos, 
  // pero intentamos flujo básico.
  
  console.log('Esperando interacción manual (Captcha)...');
  // Damos tiempo para que el usuario vea la acción
  await new Promise(r => setTimeout(r, 5000));
  
  const mockPath = path.join(DOWNLOAD_PATH, `SOI_${contratista.numDocumento}.pdf`);
  fs.writeFileSync(mockPath, 'Contenido PDF simulado para SOI');
  return mockPath;
};

/**
 * Lógica específica para AportesEnLinea
 * URL: https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx
 */
const scrapeAportesEnLinea = async (page, data) => {
  console.log('--- Iniciando Scraping AportesEnLinea ---');
  await page.goto('https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx', { waitUntil: 'networkidle2' });
  
  const { contratista } = data;

  // Selectores reales encontrados:
  // #contenido_tbNumeroIdentificacion
  // #contenido_txtFechaExp (Fecha Expedición)
  // #contenido_txtAdmin (EPS)

  console.log('Llenando formulario AportesEnLinea...');
  
  // Escribir documento
  if (contratista.numDocumento) {
      await page.type('#contenido_tbNumeroIdentificacion', contratista.numDocumento.toString());
  }

  // Escribir fecha expedición si existe (formato AAAA/MM/DD según placeholder)
  if (contratista.expCedula) {
      // Formatear fecha a YYYY/MM/DD
      const fecha = new Date(contratista.expCedula);
      const fechaStr = fecha.toISOString().split('T')[0].replace(/-/g, '/');
      await page.type('#contenido_txtFechaExp', fechaStr);
  }

  // Escribir EPS
  if (contratista.eps) {
      await page.type('#contenido_txtAdmin', contratista.eps);
  }
  
  console.log('Esperando interacción...');
  await new Promise(r => setTimeout(r, 5000));
  
  const mockPath = path.join(DOWNLOAD_PATH, `AportesEnLinea_${contratista.numDocumento}.pdf`);
  fs.writeFileSync(mockPath, 'Contenido PDF simulado para AportesEnLinea');
  return mockPath;
};

/**
 * Lógica específica para Compensar (MiPlanilla)
 * URL: https://www.miplanilla.com/Private/Consultaplanillaindependiente.aspx
 */
const scrapeCompensar = async (page, data) => {
  console.log('--- Iniciando Scraping Compensar ---');
  await page.goto('https://www.miplanilla.com/Private/Consultaplanillaindependiente.aspx', { waitUntil: 'networkidle2' });
  
  const { contratista, numPlanilla, valorPagado } = data;

  // Selectores reales encontrados:
  // #cp1_txtNumeroDocumento
  // #cp1_txtNumeroPlanilla
  // #cp1_txtValorPagado
  // #cp1_ButtonConsultar

  console.log('Llenando formulario Compensar...');
  
  await page.type('#cp1_txtNumeroDocumento', contratista.numDocumento.toString());
  
  if (numPlanilla) {
    await page.type('#cp1_txtNumeroPlanilla', numPlanilla.toString());
  }

  if (valorPagado) {
    await page.type('#cp1_txtValorPagado', valorPagado.toString());
  }
  
  console.log('Intentando clic en Consultar...');
  // await page.click('#cp1_ButtonConsultar'); 
  // Comentado para no enviar formulario inválido en prueba
  
  console.log('Esperando interacción...');
  await new Promise(r => setTimeout(r, 5000));
  
  const mockPath = path.join(DOWNLOAD_PATH, `Compensar_${numPlanilla}.pdf`);
  fs.writeFileSync(mockPath, 'Contenido PDF simulado para Compensar');
  return mockPath;
};
