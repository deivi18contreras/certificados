import path from 'path';
import { monthToNumber, getOperatorPath } from './scrapingUtils.js';
import { solveRecaptchaV2 } from '../utils/captchaService.js';

export const scrapeCompensar = async (page, { contratista, periodoPago, datosOperador }) => {
  console.log('🌐 [Compensar] Navegando a MiPlanilla...');
  await page.goto('https://www.miplanilla.com/Registro/ConsultaPagoAportes/ConsultaPagoAportes');
  
  const data = datosOperador instanceof Map ? Object.fromEntries(datosOperador) : datosOperador;
  const { numeroPlanilla, valorPagado, fechaPago } = data;

  await page.selectOption('#tipoDocumento', contratista.tipoDocumento || 'CC');
  await page.fill('#numeroDocumento', contratista.numeroDocumento);
  
  if (numeroPlanilla) {
    await page.click('#numeroPlanilla');
    await page.type('#numeroPlanilla', numeroPlanilla.toString(), { delay: 100 });
  }
  
  if (valorPagado) {
    await page.click('#valorPlanilla');
    await page.type('#valorPlanilla', valorPagado.toString(), { delay: 100 });
  }

  const mesNum = monthToNumber(periodoPago.mes);
  await page.selectOption('#periodoPagoMes', mesNum);
  await page.selectOption('#periodoPagoAnual', periodoPago.anio);

  if (fechaPago) {
    let day, month, year;
    if (fechaPago.includes('-')) [year, month, day] = fechaPago.split('-');
    else if (fechaPago.includes('/')) [day, month, year] = fechaPago.split('/');
    
    if (day && month && year) {
      const formattedDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
      await page.click('#fechaPago', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.type('#fechaPago', formattedDate, { delay: 150 });
      await page.keyboard.press('Tab');
    }
  }

  // Resolver reCAPTCHA
  try {
    const sitekey = await page.getAttribute('.g-recaptcha', 'data-sitekey');
    if (sitekey) {
      const token = await solveRecaptchaV2(page.url(), sitekey.trim());
      await page.evaluate((token) => {
        const field = document.getElementById('g-recaptcha-response');
        if (field) {
          field.innerHTML = token;
          field.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, token);
    }
  } catch (err) {
    console.warn('⚠️ reCAPTCHA no detectado o error.');
  }

  await page.click('#btnContinuar');
  await page.waitForTimeout(5000); 

  // Guardar en la carpeta específica de descargas/miplanilla
  const downloadPath = getOperatorPath('MiPlanilla');
  const captureName = `Compensar_${Date.now()}.png`;
  const finalPath = path.join(downloadPath, captureName);
  
  await page.screenshot({ path: finalPath, fullPage: true });
  console.log(`✅ [Compensar] Captura guardada en: ${finalPath}`);
  
  return finalPath;
};
