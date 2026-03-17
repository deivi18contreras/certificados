import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { scrapeSOI } from '../agente/soiScraper.js';
import { scrapeCompensar } from '../agente/miplanillaScraper.js';

// Configurar Stealth
chromium.use(StealthPlugin());

/**
 * @desc Orquestador principal de descargas (Redireccionado a src/agente)
 */
export const downloadPlanilla = async (reporte) => {
  const { operadorPago } = reporte;
  console.log(`🚀 [Agente] Iniciando proceso para: ${operadorPago}`);
  
  const isHeadless = process.env.HEADLESS === 'true';
  
  const browser = await chromium.launch({
    headless: isHeadless,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(60000); 

  try {
    const normalizedOperador = operadorPago.toLowerCase();

    if (normalizedOperador.includes('compensar') || normalizedOperador.includes('planilla')) {
      return await scrapeCompensar(page, reporte);
    } else if (normalizedOperador.includes('soi')) {
      return await scrapeSOI(page, reporte);
    } else if (normalizedOperador.includes('asopagos') || normalizedOperador.includes('enlace')) {
      const formUrl = 'https://www.enlace-apb.com/interssi/descargarCertificacionPago.jsp';
      console.log(`🔗 [Agente] Link Asopagos: ${formUrl}`);
      throw new Error('Asopagos en mantenimiento.');
    } else {
      throw new Error(`Operador ${operadorPago} no soportado actualmente.`);
    }
  } catch (error) {
    console.error(`❌ [Agente] Error en ${operadorPago}:`, error.message);
    throw error;
  } finally {
    await browser.close();
  }
};
