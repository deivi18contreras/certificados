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
    console.log(`📝 [Compensar] Ingresando Planilla: ${numeroPlanilla}`);
    await page.click('#numeroPlanilla', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#numeroPlanilla', numeroPlanilla.toString(), { delay: 100 });
    await page.keyboard.press('Tab');
  }
  
  if (valorPagado) {
    console.log(`💰 [Compensar] Ingresando Valor: ${valorPagado}`);
    await page.click('#valorPlanilla', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#valorPlanilla', valorPagado.toString(), { delay: 100 });
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
  }

  const mesNombre = periodoPago.mes.charAt(0).toUpperCase() + periodoPago.mes.slice(1).toLowerCase();
  const mesNumRaw = monthToNumber(periodoPago.mes);
  
  console.log(`📅 [Compensar] Configurando periodo: ${mesNombre} de ${periodoPago.anio}`);

  await page.waitForSelector('#periodoPagoMes');
  await page.selectOption('#periodoPagoMes', { label: mesNombre }).catch(async () => {
    await page.selectOption('#periodoPagoMes', { value: mesNumRaw });
  });

  await page.waitForSelector('#periodoPagoAnual');
  await page.selectOption('#periodoPagoAnual', { value: periodoPago.anio.toString() });

  if (fechaPago) {
    let day, month, year;
    // Si la fecha es un objeto Date de Mongo, viene como string ISO
    const d = new Date(fechaPago);
    if (!isNaN(d.getTime())) {
      day = d.getDate().toString().padStart(2, '0');
      month = (d.getMonth() + 1).toString().padStart(2, '0');
      year = d.getFullYear().toString();
    } else {
      if (fechaPago.includes('-')) [year, month, day] = fechaPago.split('-');
      else if (fechaPago.includes('/')) [day, month, year] = fechaPago.split('/');
    }
    
    if (day && month && year) {
      // Formato mm/dd/yyyy solicitado para MiPlanilla
      // Forzamos el 13 extrayendo del string para evitar desfases de zona horaria
      const rawDate = new Date(fechaPago);
      const isoString = rawDate.toISOString(); // "2026-02-13T00:00:00.000Z"
      const parts = isoString.split('T')[0].split('-'); // ["2026", "02", "13"]

      const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`; // "02/13/2026"
      console.log(`📅 [Compensar] Escribiendo fecha pago (02/13/2026): ${formattedDate}`);

      const fechaInput = page.locator('#fechaPago');
      await fechaInput.click({ clickCount: 3 });
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');

      for (const char of formattedDate) {
        await page.keyboard.type(char, { delay: 150 });
      }

      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);
    }
  }

  // Resolver reCAPTCHA
  console.log('🧩 [Compensar] Resolviendo reCAPTCHA...');
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
      console.log('✅ [Compensar] Token de reCAPTCHA inyectado.');
    }
  } catch (err) {
    console.warn('⚠️ reCAPTCHA no detectado o error en Compensar.');
  }

  console.log('🚀 [Compensar] Pulsando botón continuar...');
  await page.click('#btnContinuar', { force: true });
  await page.waitForTimeout(5000); 

  // Guardar en la carpeta específica de descargas/miplanilla
  const downloadPath = getOperatorPath('MiPlanilla');
  const captureName = `Compensar_${Date.now()}.png`;
  const finalPath = path.join(downloadPath, captureName);
  
  await page.screenshot({ path: finalPath, fullPage: true });
  console.log(`✅ [Compensar] Captura guardada en: ${finalPath}`);
  
  return finalPath;
};
