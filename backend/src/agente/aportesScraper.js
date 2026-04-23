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

  // 4. EPS (Autocomplete mejorado - Método Enter directo)
  if (contratista.eps) {
    const epsText = contratista.eps.toUpperCase();
    const isNuevaEPS = epsText.includes('NUEVA');
    const isSanitas = epsText.includes('SANITAS');
    
    // Si es Sanitas, escribimos SANITAS; si es Nueva EPS, NUEVA
    const textToType = isNuevaEPS ? 'NUEVA' : (isSanitas ? 'SANITAS' : contratista.eps);
    console.log(`🔍 [Aportes] Buscando EPS: Escribiendo '${textToType}' y lanzando Enter inmediato...`);
    
    const epsInput = page.locator('#contenido_txtAdmin');
    await epsInput.click({ clickCount: 3 });
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await epsInput.type(textToType, { delay: 150 });
    
    try {
      await page.waitForTimeout(2000); 
      await page.keyboard.press('Enter');
      console.log(`✅ [Aportes] EPS '${textToType}' seleccionada satisfactoriamente.`);
    } catch (err) {
      console.warn(`⚠️ [Aportes] Error en autocompletar: ${err.message}.`);
    }
    await page.waitForTimeout(1000);
  }

  // 5. Rango de Fechas (NUMÉRICO ESTRICTO)
  const anioIni = periodoPago.anio.toString();
  const mesNumRaw = monthToNumber(periodoPago.mes); 
  const mesNumClean = parseInt(mesNumRaw).toString();

  console.log(`📅 [Aportes] Configurando periodo: Mes ${mesNumRaw}/${mesNumClean} de ${anioIni}`);

  await page.waitForSelector('#contenido_ddlAnioIni');
  await page.locator('#contenido_ddlAnioIni').selectOption(anioIni);
  await page.waitForTimeout(500);
  
  await page.locator('#contenido_ddlMesIni').selectOption(mesNumRaw).catch(() => 
    page.locator('#contenido_ddlMesIni').selectOption(mesNumClean)
  );
  
  await page.locator('#contenido_ddlAnioFin').selectOption(anioIni);
  await page.waitForTimeout(500);
  
  await page.locator('#contenido_ddlMesFin').selectOption(mesNumRaw).catch(() => 
    page.locator('#contenido_ddlMesFin').selectOption(mesNumClean)
  );

  // 6. Cotizante Activo (Label as button)
  await page.locator('label.button:has-text("Cotizante activo")').click();

  // 7. reCAPTCHA
  console.log('🧩 [Aportes] Identificando reCAPTCHA Enterprise...');
  try {
    // 1. Esperar a que el widget sea visible o esté en el DOM
    await page.waitForSelector('.g-recaptcha, [data-sitekey]', { timeout: 10000 }).catch(() => null);

    // 2. Intentar obtener el sitekey de varias fuentes
    let sitekey = await page.evaluate(() => {
      const el = document.querySelector('.g-recaptcha') || document.querySelector('[data-sitekey]');
      if (el) return el.getAttribute('data-sitekey');
      
      // Intentar buscar en el objeto window si ya se cargó grecaptcha
      try {
        if (window.___grecaptcha_cfg && window.___grecaptcha_cfg.clients) {
          for (const key in window.___grecaptcha_cfg.clients) {
            const client = window.___grecaptcha_cfg.clients[key];
            for (const p in client) {
              if (client[p] && client[p].sitekey) return client[p].sitekey;
            }
          }
        }
      } catch (e) {}
      return null;
    });

    if (!sitekey) {
      sitekey = '6Lc6FDMUAAAAAKwQX0_xF92Z1MiUXm4sYbQ6bh6J';
      console.log('ℹ️ [Aportes] No se detectó sitekey dinámico. Usando respaldo: ' + sitekey);
    } else {
      console.log('✅ [Aportes] Sitekey detectado: ' + sitekey);
    }

    const token = await solveRecaptchaV2(page.url(), sitekey, true);
    console.log('💉 [Aportes] Inyectando token...');
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
    // Extraer posible error del DOM (lblError, span rojo, alert)
    const errorFromPage = await page.evaluate(() => {
      // Buscar elementos típicos de error devueltos en Aportes
      const errorElements = Array.from(document.querySelectorAll('span[id*="lblError"], .alert-danger, .msg-error, .text-danger, span[style*="color:Red"]'));
      for (const el of errorElements) {
        if (el && el.innerText.trim() !== '') return el.innerText.trim();
      }
      return null;
    }).catch(() => null);

    if (errorFromPage) {
      throw new Error(`Mensaje de la página: ${errorFromPage}`);
    }

    console.log(`⚠️ [Aportes] Error genérico detectado (${err.message}).`);
    throw new Error(`Fallo en Aportes (Captcha/Popup): ${err.message}`);
  }
};
