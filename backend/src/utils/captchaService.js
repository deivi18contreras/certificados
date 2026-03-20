import { Solver } from '2captcha';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.TWO_CAPTCHA_API_KEY;

// Inicializar el solver con la API Key del .env (para reCAPTCHA)
const solver = new Solver(API_KEY);

/**
 * @desc Resuelve reCAPTCHA V2 (Aportes/Compensar)
 */
export const solveRecaptchaV2 = async (url, sitekey, isEnterprise = false) => {
  const cleanSitekey = sitekey.trim();
  console.log(`🧩 [2captcha] Iniciando resolución de reCAPTCHA V2... (${isEnterprise ? 'ENTERPRISE' : 'ESTÁNDAR'}) (Key: ${API_KEY ? 'Cargada' : 'FALTANTE'})`);
  try {
    const params = isEnterprise ? { enterprise: 1 } : {};
    const res = await solver.recaptcha(cleanSitekey, url, params);
    console.log('✅ [2captcha] reCAPTCHA V2 resuelto exitosamente.');
    return res.data; 
  } catch (err) {
    console.error('❌ [2captcha] Error reCAPTCHA:', err.message);
    throw new Error(`Error de Captcha: ${err.message}`);
  }
};

/**
 * @desc Resuelve Captcha de Imagen (Letras/Números) - USANDO API DIRECTA
 */
export const solveImageCaptcha = async (base64Image) => {
  console.log('🧩 [2captcha] Iniciando resolución de Imagen vía SDK Oficial...');
  try {
    const res = await solver.imageCaptcha(base64Image);
    console.log('✅ [2captcha] Texto obtenido:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ [2captcha] Error imagen SDK:', err.message);
    throw new Error(`Error de Captcha Imagen: ${err.message}`);
  }
};
