import { monthToNumber, handleDownload } from './scrapingUtils.js';
import { solveRecaptchaV2 } from '../utils/captchaService.js';

export const scrapeSOI = async (page, { contratista, periodoPago }) => {
  console.log('🌐 [SOI] Navegando a la página de certificados...');
  await page.goto('https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do');
  
  const mapDocSOI = { 'CC': '1', 'CE': '6', 'NIT': '2', 'PEP': '9', 'PPT': '10' };
  
  console.log('📝 [SOI] Ingresando datos del Aportante...');
  await page.selectOption('#tipoDocumentoAportante', mapDocSOI[contratista.tipoDocumento] || '1');
  await page.fill('input[name="numeroDocumentoAportante"]', contratista.numeroDocumento);
  await page.keyboard.press('Tab');

  console.log('📝 [SOI] Ingresando datos del Cotizante...');
  await page.selectOption('#tipoDocumentoCotizante', mapDocSOI[contratista.tipoDocumento] || '1');
  await page.fill('#numeroDocumentoCotizante', contratista.numeroDocumento);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(1000);

  let epsVal = '128'; 
  const eps = (contratista.eps || '').toUpperCase();
  if (eps.includes('NUEVA')) epsVal = '171';
  else if (eps.includes('SUR')) epsVal = '132';
  else if (eps.includes('COMPENSAR')) epsVal = '130';
  
  console.log(`🏥 [SOI] Seleccionando Administradora: ${eps} (Valor: ${epsVal})`);
  await page.waitForSelector('#administradoraSalud');
  await page.selectOption('#administradoraSalud', epsVal);
  await page.waitForTimeout(1000);

  const mesNombre = periodoPago.mes.charAt(0).toUpperCase() + periodoPago.mes.slice(1).toLowerCase();
  const mesNum = parseInt(monthToNumber(periodoPago.mes)).toString();
  
  console.log(`📅 [SOI] Seleccionando periodo: ${mesNombre} de ${periodoPago.anio}`);
  
  await page.waitForSelector('#periodoLiqSaludMes');
  // Forzar selección por nombre de mes (etiqueta visible)
  await page.selectOption('#periodoLiqSaludMes', { label: mesNombre }).catch(async () => {
    await page.selectOption('#periodoLiqSaludMes', { value: mesNum });
  });

  await page.waitForSelector('#periodoLiqSaludAnnio');
  await page.selectOption('#periodoLiqSaludAnnio', { value: periodoPago.anio.toString() });
  await page.waitForTimeout(1000);

  // Manejo de reCAPTCHA
  console.log('🧩 [SOI] Resolviendo reCAPTCHA...');
  const sitekey = await page.$eval('.g-recaptcha', el => el.getAttribute('data-sitekey')).catch(() => null);
  if (sitekey) {
    const token = await solveRecaptchaV2(page.url(), sitekey);
    await page.evaluate((token) => {
      document.getElementById('g-recaptcha-response').innerHTML = token;
    }, token);
  }

  const [ download ] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('button.btn-success')
  ]);

  return await handleDownload(download, 'SOI');
};
