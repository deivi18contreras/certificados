import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import admZip from 'adm-zip';
import { solveRecaptchaV2, solveImageCaptcha } from './captchaService.js';

// Configurar Stealth
chromium.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOWNLOAD_PATH = path.join(__dirname, '../../temp_downloads');

if (!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
}

const monthToNumber = (monthName) => {
  const months = {
    'enero': '1', 'febrero': '2', 'marzo': '3', 'abril': '4',
    'mayo': '5', 'junio': '6', 'julio': '7', 'agosto': '8',
    'septiembre': '9', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
  };
  return months[monthName.toLowerCase()] || '1';
};

/**
 * @desc Lógica principal con Playwright
 */
export const downloadPlanilla = async (reporte) => {
  const { operadorPago, contratista, periodoPago, datosOperador } = reporte;
  
  console.log(`🚀 Iniciando Playwright para ${operadorPago}...`);
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(45000); 
  page.setDefaultNavigationTimeout(60000);

  try {
    let filePath = '';
    const normalizedOperador = operadorPago.toLowerCase();

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Tiempo de espera agotado (Timeout Global 2min)')), 120000)
    );

    const scrapingTask = (async () => {
        if (normalizedOperador.includes('aportes')) {
          return await scrapeAportesEnLinea(page, { contratista, periodoPago });
        } else if (normalizedOperador.includes('compensar')) {
          return await scrapeCompensar(page, { contratista, datosOperador });
        } else if (normalizedOperador.includes('soi')) {
          return await scrapeSOI(page, { contratista, periodoPago });
        } else {
          throw new Error(`Operador ${operadorPago} no soportado.`);
        }
    })();

    filePath = await Promise.race([scrapingTask, timeoutPromise]);
    return filePath;
  } catch (error) {
    console.error(`❌ Error en Playwright (${operadorPago}):`, error.message);
    throw error;
  } finally {
    await browser.close();
  }
};

/**
 * @desc Manejador de descargas inteligente (maneja ZIP y PDF)
 */
const handleDownload = async (download, prefix) => {
  const suggestedName = download.suggestedFilename();
  const tempPath = path.join(DOWNLOAD_PATH, suggestedName);
  await download.saveAs(tempPath);

  if (suggestedName.toLowerCase().endsWith('.zip')) {
    console.log(`📦 Detectado archivo ZIP: ${suggestedName}. Descomprimiendo...`);
    const zip = new admZip(tempPath);
    const zipEntries = zip.getEntries();
    
    // Buscar el primer PDF dentro del ZIP
    const pdfEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.pdf'));
    
    if (pdfEntry) {
      const finalName = `${prefix}_${Date.now()}.pdf`;
      const finalPath = path.join(DOWNLOAD_PATH, finalName);
      fs.writeFileSync(finalPath, pdfEntry.getData());
      
      // Limpiar el ZIP temporal
      fs.unlinkSync(tempPath);
      console.log(`✅ PDF extraído con éxito: ${finalName}`);
      return finalPath;
    } else {
      throw new Error('No se encontró ningún PDF dentro del archivo ZIP descargado.');
    }
  } else {
    // Es un PDF directo
    const finalName = `${prefix}_${Date.now()}.pdf`;
    const finalPath = path.join(DOWNLOAD_PATH, finalName);
    fs.renameSync(tempPath, finalPath);
    console.log(`✅ PDF guardado con éxito: ${finalName}`);
    return finalPath;
  }
};

const scrapeAportesEnLinea = async (page, { contratista, periodoPago }) => {
  await page.goto('https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx');
  
  const mapDoc = { 'CC': '1', 'CE': '2', 'TI': '5', 'PEP': '10', 'PPT': '11' };
  await page.selectOption('#contenido_ddlTipoIdent', mapDoc[contratista.tipoDocumento] || '1');
  await page.fill('#contenido_tbNumeroIdentificacion', contratista.numeroDocumento);
  
  if (contratista.fechaExpedicion) {
    const fecha = new Date(contratista.fechaExpedicion).toISOString().split('T')[0].replace(/-/g, '/');
    await page.fill('#contenido_txtFechaExp', fecha);
  }

  await page.fill('#contenido_txtAdmin', contratista.eps || 'SANITAS');

  const mesNum = monthToNumber(periodoPago.mes);
  await page.selectOption('#contenido_ddlAnioIni', periodoPago.anio);
  await page.selectOption('#contenido_ddlMesIni', mesNum);
  await page.selectOption('#contenido_ddlAnioFin', periodoPago.anio);
  await page.selectOption('#contenido_ddlMesFin', mesNum);

  // RESOLVER RECAPTCHA V2
  console.log('🧩 [Aportes] Buscando reCAPTCHA...');
  try {
    // Esperar a que el contenedor del captcha aparezca
    await page.waitForSelector('.g-recaptcha', { timeout: 10000 });
    const sitekey = await page.getAttribute('.g-recaptcha', 'data-sitekey');
    
    if (sitekey && sitekey.length > 10) {
      console.log(`🧩 [Aportes] Sitekey detectado: ${sitekey.substring(0, 5)}...`);
      const token = await solveRecaptchaV2(page.url(), sitekey);
      
      await page.evaluate((token) => {
        const responseField = document.getElementById('g-recaptcha-response');
        if (responseField) {
          responseField.innerHTML = token;
        }
        // Disparar evento de cambio por si el sitio lo escucha
        const event = new Event('change', { bubbles: true });
        responseField?.dispatchEvent(event);
      }, token);
      
      console.log('✅ [Aportes] reCAPTCHA inyectado con éxito.');
    } else {
      console.warn('⚠️ [Aportes] No se encontró un sitekey válido en .g-recaptcha');
    }
  } catch (err) {
    console.warn('⚠️ [Aportes] El reCAPTCHA no apareció o no pudo ser leído:', err.message);
  }

  const [ download ] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }), 
    page.click('#contenido_btnCalcular')
  ]);

  return await handleDownload(download, 'Aportes');
};

const scrapeCompensar = async (page, { contratista, datosOperador }) => {
  await page.goto('https://www.miplanilla.com/Private/Consultaplanillaindependiente.aspx');
  
  const numeroPlanilla = typeof datosOperador === 'object' ? datosOperador.numeroPlanilla : '';

  await page.fill('#txtNumeroDocumento', contratista.numeroDocumento);
  await page.fill('#txtNumeroPlanilla', numeroPlanilla || '');
  
  // RESOLVER CAPTCHA DE IMAGEN (Si es que usa imagen, si usa reCAPTCHA es igual al anterior)
  // Nota: MiPlanilla a veces usa una imagen simple.
  const captchaImg = await page.$('#imgCaptcha'); // Ajustar selector según real
  if (captchaImg) {
    console.log('🧩 [Compensar] Detectado captcha de imagen. Resolviendo...');
    const base64 = await captchaImg.screenshot({ type: 'png', encoding: 'base64' });
    const text = await solveImageCaptcha(base64);
    await page.fill('#txtCaptcha', text); // Ajustar selector según real
    console.log('✅ [Compensar] Captcha de imagen resuelto.');
  }

  const [ download ] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('#btnConsultar')
  ]);

  return await handleDownload(download, 'Compensar');
};

const scrapeSOI = async (page, { contratista, periodoPago }) => {
  await page.goto('https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do');
  
  const mapDocSOI = { 'CC': '1', 'CE': '6', 'NIT': '2', 'PEP': '9', 'PPT': '10' };
  await page.selectOption('#tipoDocumentoAportante', mapDocSOI[contratista.tipoDocumento] || '1');
  await page.fill('input[name="numeroDocumentoAportante"]', contratista.numeroDocumento);

  await page.selectOption('#tipoDocumentoCotizante', mapDocSOI[contratista.tipoDocumento] || '1');
  await page.fill('#numeroDocumentoCotizante', contratista.numeroDocumento);

  let epsVal = '128'; 
  const eps = (contratista.eps || '').toUpperCase();
  if (eps.includes('NUEVA')) epsVal = '171';
  else if (eps.includes('SUR')) epsVal = '132';
  else if (eps.includes('COMPENSAR')) epsVal = '130';
  
  await page.selectOption('#administradoraSalud', epsVal);

  const mesNum = monthToNumber(periodoPago.mes);
  await page.selectOption('#periodoLiqSaludMes', mesNum);
  await page.selectOption('#periodoLiqSaludAnnio', periodoPago.anio);

  // SOI a veces pone reCAPTCHA si hay mucho tráfico.
  const sitekey = await page.$eval('.g-recaptcha', el => el.getAttribute('data-sitekey')).catch(() => null);
  if (sitekey) {
    console.log('🧩 [SOI] Detectado reCAPTCHA inesperado. Resolviendo...');
    const token = await solveRecaptchaV2(page.url(), sitekey);
    await page.evaluate((token) => {
      document.getElementById('g-recaptcha-response').innerHTML = token;
    }, token);
  }

  console.log('🚀 Iniciando descarga en SOI...');
  const [ download ] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('button.btn-success')
  ]);

  return await handleDownload(download, 'SOI');
};
