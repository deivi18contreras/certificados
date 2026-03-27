import path from 'path';
import { solveImageCaptcha } from '../utils/captchaService.js';
import { getOperatorPath, monthToNumber } from './scrapingUtils.js';

export const scrapeAsopagos = async (page, { contratista, periodoPago, datosOperador }) => {
  console.log('🌐 [Asopagos] Navegando a portal de descargas...');
  const url = 'https://www.enlace-apb.com/interssi/descargarCertificacionPago.jsp';
  await page.goto(url, { waitUntil: 'load' });
  
  // 1. Tipo de identificación
  await page.locator('#tipoID').selectOption({ value: contratista.tipoDocumento });
  
  // 2. Número de identificación
  await page.locator('#numeroID').fill(contratista.numeroDocumento);
  
  // 3. Año
  await page.locator('#ano').fill(periodoPago.anio);
  
  // 4. Mes
  const mesNum = monthToNumber(periodoPago.mes);
  const mesValue = mesNum.padStart(2, '0');
  await page.locator('#mes').selectOption({ value: mesValue });
  
  // 5. Tipo de reporte
  await page.locator('#tipoReporte').selectOption({ value: 'sinValores' });
  
  // 6. Captcha
  console.log('🧩 [Asopagos] Resolviendo Captcha de imagen...');
  const captchaImg = page.locator('#captcha_imgpop');
  await captchaImg.waitFor({ state: 'visible' });
  
  // Extraer la imagen base64
  const captchaBuffer = await captchaImg.screenshot();
  const base64Captcha = captchaBuffer.toString('base64');
  
  // Enviar a 2captcha
  const captchaText = await solveImageCaptcha(base64Captcha);
  console.log(`✅ [Asopagos] Texto del captcha: ${captchaText}`);
  
  // Llenar captcha
  await page.locator('#captchaIn').fill(captchaText);

  // 7. Enviar formulario
  console.log('🚀 [Asopagos] Consultando...');
  
  // Al hacer click, la página dispara la descarga o muestra un error en pantalla (alert/sweetalert/div)
  const downloadPromise = page.waitForEvent('download', { timeout: 45000 }).catch(() => null);
  await page.locator('#enviarConsRP').click();
  
  const download = await downloadPromise;
  
  // Guardar en la carpeta específica
  const downloadPath = getOperatorPath('Asopagos');
  const finalPath = path.join(downloadPath, `Asopagos_${contratista.numeroDocumento}_${Date.now()}`);

  if (download) {
    const pdfPath = finalPath + '.pdf';
    await download.saveAs(pdfPath);
    console.log(`📄 [Asopagos] Certificado descargado en: ${pdfPath}`);
    return pdfPath;
  } else {
    // Si falla o no descarga, intentar leer el error de la página
    const errorFromPage = await page.evaluate(() => {
      // Usualmente los errores de Asopagos se insertan en divs de mensaje o en texto plano sin estilo
      // Podemos buscar textos comunes en el body
      const bodyText = document.body.innerText || '';
      if (bodyText.includes('El empleado seleccionado no existe')) {
        return 'El empleado seleccionado no existe o no se encuentra presente en una planilla paga.';
      } else if (bodyText.includes('Captcha')) {
        return 'Captcha incorrecto o expirado.';
      }
      return null;
    }).catch(() => null);

    if (errorFromPage) {
      throw new Error(`Mensaje del portal: ${errorFromPage}`);
    }

    console.log(`⚠️ [Asopagos] No se detectó descarga ni error específico (${err.message}).`);
    throw new Error('Asopagos no retornó descarga y produjo un error inesperado.');
  }
};

function getMonthName(mesStr) {
  const meses = {
    '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
    '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
    '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
  };
  return meses[mesStr.padStart(2, '0')] || mesStr;
}
