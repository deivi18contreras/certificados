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
export const solveRecaptchaV2 = async (url, sitekey) => {
  const cleanSitekey = sitekey.trim();
  console.log('🧩 [2captcha] Iniciando resolución de reCAPTCHA V2...');
  try {
    const res = await solver.recaptcha(cleanSitekey, url);
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
  console.log('🧩 [2captcha] Iniciando resolución de Imagen (4-6 caracteres) vía API Directa...');
  
  try {
    // 1. Enviar la imagen para resolver
    const response = await axios.post('https://2captcha.com/in.php', null, {
      params: {
        key: API_KEY,
        method: 'base64',
        body: base64Image,
        json: 1,
        regsense: 1 // Sensible a mayúsculas/minúsculas para mayor precisión
      }
    });

    if (response.data.status !== 1) {
      throw new Error(response.data.request || 'Error enviando imagen');
    }

    const captchaId = response.data.request;
    console.log(`⏳ [2captcha] ID de tarea: ${captchaId}. Esperando resultado...`);

    // 2. Poll para obtener el resultado
    for (let i = 0; i < 15; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const res = await axios.get('https://2captcha.com/res.php', {
        params: {
          key: API_KEY,
          action: 'get',
          id: captchaId,
          json: 1
        }
      });

      if (res.data.status === 1) {
        console.log('✅ [2captcha] Texto obtenido:', res.data.request);
        return res.data.request;
      }

      if (res.data.request !== 'CAPCHA_NOT_READY') {
        throw new Error(res.data.request);
      }
      console.log('... todavía no está listo ...');
    }

    throw new Error('Tiempo de espera agotado para el captcha');
  } catch (err) {
    console.error('❌ [2captcha] Error imagen API:', err.message);
    throw new Error(`Error de Captcha Imagen: ${err.message}`);
  }
};
