import { monthToNumber, handleDownload } from '../scrapingUtils.js';
import { solveRecaptchaV2 } from '../../utils/captchaService.js';

export const scrapeSOI = async (page, { contratista, periodoPago }) => {
  console.log('🌐 [SOI] Navegando a la página de certificados...');
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

  // Manejo de reCAPTCHA si aparece
  const sitekey = await page.$eval('.g-recaptcha', el => el.getAttribute('data-sitekey')).catch(() => null);
  if (sitekey) {
    console.log('🧩 [SOI] Detectado reCAPTCHA. Resolviendo...');
    const token = await solveRecaptchaV2(page.url(), sitekey);
    await page.evaluate((token) => {
      document.getElementById('g-recaptcha-response').innerHTML = token;
    }, token);
  }

  console.log('🚀 [SOI] Iniciando descarga...');
  const [ download ] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('button.btn-success')
  ]);

  return await handleDownload(download, 'SOI');
};
