import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { scrapeSOI } from '../agente/soiScraper.js';
import { scrapeCompensar } from '../agente/miplanillaScraper.js';
import { scrapeAsopagos } from '../agente/asopagosScraper.js';
import { scrapeAportes } from '../agente/aportesScraper.js';

// Configurar Stealth
chromium.use(StealthPlugin());

/**
 * @desc Orquestador principal de descargas (Redireccionado a src/agente)
 */
export const downloadPlanilla = async (reporte) => {
  const { operadorPago } = reporte;
  const isHeadless = process.env.HEADLESS === 'true';
  const MAX_RETRIES = 2;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`🚀 [Agente] Intento ${attempt}/${MAX_RETRIES} para: ${operadorPago}`);
    let browser = await chromium.launch({
      headless: isHeadless,
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
    });

    try {
      const context = await browser.newContext({
        acceptDownloads: true,
        viewport: { width: 1280, height: 720 }
      });
      const page = await context.newPage();
      page.setDefaultTimeout(60000);

      const normalizedOperador = operadorPago.toLowerCase();
      let result;

      if (normalizedOperador.includes('compensar') || normalizedOperador.includes('planilla')) {
        result = await scrapeCompensar(page, reporte);
      } else if (normalizedOperador.includes('soi')) {
        result = await scrapeSOI(page, reporte);
      } else if (normalizedOperador.includes('asopagos') || normalizedOperador.includes('enlace')) {
        console.log(`🔗 [Agente] Ejecutando scraper de Asopagos...`);
        result = await scrapeAsopagos(page, reporte);
      } else if (normalizedOperador.includes('aportes')) {
        console.log(`🔗 [Agente] Ejecutando scraper de Aportes en Línea...`);
        result = await scrapeAportes(page, reporte);
      } else {
        throw new Error(`Operador ${operadorPago} no soportado actualmente.`);
      }

      await browser.close();
      return result; // Si fue exitoso, retornamos y salimos del loop
    } catch (error) {
      await browser.close().catch(() => {});
      console.warn(`⚠️ [Agente] Error en intento ${attempt} para ${operadorPago}: ${error.message}`);
      
      if (attempt === MAX_RETRIES) {
        console.error(`❌ [Agente] Falló definitivamente después de ${MAX_RETRIES} intentos para ${operadorPago}: ${error.message}`);
        throw error;
      }
      
      console.log(`⏳ Esperando 5 segundos antes del próximo intento...`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
};
