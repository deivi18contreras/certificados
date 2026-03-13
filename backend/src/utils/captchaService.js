import { Solver } from '2captcha';
import dotenv from 'dotenv';
dotenv.config();

// Inicializar el solver con la API Key del .env
const solver = new Solver(process.env.TWO_CAPTCHA_API_KEY);

/**
 * @desc Resuelve reCAPTCHA V2 (Aportes/Compensar)
 * @param {string} url - La URL donde está el captcha
 * @param {string} sitekey - El data-sitekey extraído del HTML
 */
export const solveRecaptchaV2 = async (url, sitekey) => {
  console.log('🧩 [2captcha] Iniciando resolución de reCAPTCHA V2...');
  try {
    const res = await solver.recaptcha({
      pageurl: url,
      googlekey: sitekey
    });
    console.log('✅ [2captcha] Token obtenido con éxito.');
    return res.data; // Este es el token que inyectaremos
  } catch (err) {
    console.error('❌ [2captcha] Error resolviendo reCAPTCHA:', err.message);
    throw new Error(`Error de Captcha: ${err.message}`);
  }
};

/**
 * @desc Resuelve Captcha de Imagen (Letras/Números distorsionados)
 * @param {string} base64Image - La imagen en formato base64
 */
export const solveImageCaptcha = async (base64Image) => {
  console.log('🧩 [2captcha] Iniciando resolución de Imagen...');
  try {
    const res = await solver.imageCaptcha(base64Image);
    console.log('✅ [2captcha] Texto obtenido:', res.data);
    return res.data; // El texto del captcha
  } catch (err) {
    console.error('❌ [2captcha] Error resolviendo imagen:', err.message);
    throw new Error(`Error de Captcha Imagen: ${err.message}`);
  }
};
