import path from 'path';
import { solveRecaptchaV2 } from '../utils/captchaService.js';
import { getOperatorPath, monthToNumber } from './scrapingUtils.js';

export const scrapeAportes = async (page, { contratista, periodoPago, datosOperador }) => {
  console.log('🌐 [Aportes] Navegando a portal de certificados...');
  const url = 'https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx';
  await page.goto(url, { waitUntil: 'load' });

  // 1. Tipo de documento
  const mapDoc = { 'CC': '1', 'CE': '2', 'PEP': '9', 'PPT': '10' };
  await page.locator('#contenido_ddlTipoIdent').selectOption({ value: mapDoc[contratista.tipoDocumento] || '1' });

  // 2. Número de documento
  await page.locator('#contenido_tbNumeroIdentificacion').fill(contratista.numeroDocumento);

  // 3. Fecha de expedición (Formato AAAA/MM/DD)
  const fechaExp = contratista.fechaExpedicion;
  if (fechaExp) {
    let dateStr = "";
    if (fechaExp instanceof Date) {
      dateStr = fechaExp.toISOString().split('T')[0].replace(/-/g, '/');
    } else {
      dateStr = fechaExp.toString().split('T')[0].replace(/-/g, '/');
    }
    console.log(`📅 [Aportes] Ingresando fecha exp: ${dateStr}`);
    await page.locator('#contenido_txtFechaExp').fill(dateStr);
  }

  // 4. EPS (Autocomplete mejorado)
  if (contratista.eps) {
    console.log(`🔍 [Aportes] Buscando EPS: ${contratista.eps}...`);
    const epsInput = page.locator('#contenido_txtAdmin');
    await epsInput.fill('');
    const textToType = contratista.eps;
    await epsInput.type(textToType, { delay: 100 });
    try {
      console.log(`⏳ [Aportes] Esperando estabilidad del autocompletar...`);
      await page.waitForTimeout(2000); // Dar tiempo real a que el DOM se actualice

      // 1. Intentar clickear directamente por el texto que el usuario quiere
      if (textToType.toLowerCase().includes('nueva')) {
        const option = page.locator('.ui-menu-item, li').filter({ hasText: 'NUEVA E.P.S.' }).first();
        if (await option.isVisible()) {
          console.log(`🎯 [Aportes] Opción exacta encontrada: NUEVA E.P.S.`);
          await option.click({ force: true });
          console.log('✅ [Aportes] EPS seleccionada satisfactoriamente (Directo).');
          return;
        }
      }

      // 2. Fallback: Intentar con cualquier item visible
      const fallbackOption = page.locator('li.ui-menu-item:visible, .ui-autocomplete-item:visible').first();
      if (await fallbackOption.isVisible()) {
        console.log(`🎯 [Aportes] Seleccionando primera opción visible disponible.`);
        await fallbackOption.click({ force: true });
        console.log('✅ [Aportes] EPS seleccionada satisfactoriamente (Fallback visible).');
      } else {
        throw new Error('No se encontraron opciones visibles');
      }

    } catch (err) {
      console.warn(`⚠️ [Aportes] No se pudo seleccionar de la lista: ${err.message}`);
      console.log('⌨️ [Aportes] Intentando con teclado (Enter directo)...');
      // A veces no hace falta ArrowDown si ya está filtrado y el primero está "pseudo-seleccionado"
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    }
  }

  // 5. Rango de Fechas (Mismo mes solicitado por el usuario)
  const anioIni = periodoPago.anio;
  const mesIni = monthToNumber(periodoPago.mes);

  await page.locator('#contenido_ddlAnioIni').selectOption({ value: anioIni });
  await page.locator('#contenido_ddlMesIni').selectOption({ value: mesIni });
  await page.locator('#contenido_ddlAnioFin').selectOption({ value: anioIni });
  await page.locator('#contenido_ddlMesFin').selectOption({ value: mesIni });

  // 6. Cotizante Activo (Label as button)
  await page.locator('label.button:has-text("Cotizante activo")').click();

  // 7. reCAPTCHA
  console.log('🧩 [Aportes] Resolviendo reCAPTCHA Enterprise...');
  try {
    // Intentar obtener de .g-recaptcha o usar el hardcoded del usuario
    let sitekey = await page.getAttribute('.g-recaptcha', 'data-sitekey').catch(() => null);
    if (!sitekey) {
      sitekey = '6Lc6FDMUAAAAAKwQX0_xF92Z1MiUXm4sYbQ6bh6J';
      console.log('ℹ️ [Aportes] Usando sitekey de respaldo (Enterprise).');
    }

    const token = await solveRecaptchaV2(page.url(), sitekey, true);
    await page.evaluate((token) => {
      // 1. Inyectar en todos los campos posibles de recaptcha response
      const fields = document.querySelectorAll('[id^="g-recaptcha-response"]');
      fields.forEach(field => {
        field.innerHTML = token;
        field.value = token;
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });

      // 2. Ejecutar callback interno si existe
      try {
        const cfg = window.___grecaptcha_cfg;
        if (cfg && cfg.clients) {
          for (const key in cfg.clients) {
            const client = cfg.clients[key];
            for (const p in client) {
              if (client[p] && client[p].callback) {
                const cb = client[p].callback;
                if (typeof cb === 'function') cb(token);
                else if (typeof cb === 'string' && window[cb]) window[cb](token);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Error ejecutando callback de recaptcha:', e);
      }
    }, token);
    console.log('✅ [Aportes] Token de reCAPTCHA Enterprise inyectado y callback ejecutado.');
  } catch (err) {
    console.warn('⚠️ [Aportes] Error en resolución de reCAPTCHA:', err.message);
  }

  // 8. Generar certificado (Manejo de Popup)
  console.log('🚀 [Aportes] Generando certificado...');

  const downloadPath = getOperatorPath('Aportes');
  const finalFilename = `Aportes_${contratista.numeroDocumento}_${Date.now()}`;

  try {
    // Escuchar tanto por descarga como por nueva página (popup)
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 30000 }),
      page.locator('#contenido_btnCalcular').click()
    ]);

    console.log('📄 [Aportes] Ventana emergente detectada. Procesando...');

    // Intentar capturar el PDF interceptando la respuesta de red
    const pdfPath = path.join(downloadPath, `${finalFilename}.pdf`);
    let pdfBuffer = null;

    newPage.on('response', async (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.toLowerCase().includes('application/pdf')) {
        console.log(`📡 [Aportes] PDF interceptado: ${response.url()}`);
        pdfBuffer = await response.body();
      }
    });

    await newPage.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Dar tiempo a que cargue el PDF

    if (pdfBuffer) {
      import('fs').then(fs => fs.writeFileSync(pdfPath, pdfBuffer));
      console.log(`✅ [Aportes] PDF original guardado en: ${pdfPath}`);
      await newPage.close();
      return pdfPath;
    }

    // 3. Fallback a captura de pantalla si no se interceptó
    const pngPath = path.join(downloadPath, `${finalFilename}.png`);
    await newPage.screenshot({ path: pngPath, fullPage: true });
    console.log(`✅ [Aportes] Certificado capturado (PNG) en: ${pngPath}`);
    await newPage.close();
    return pngPath;

  } catch (err) {
    console.log('⚠️ [Aportes] No se detectó popup automático o hubo un error. Capturando página principal...');
    const pngPath = path.join(downloadPath, `${finalFilename}_error.png`);
    await page.screenshot({ path: pngPath, fullPage: true });
    return pngPath;
  }
};
