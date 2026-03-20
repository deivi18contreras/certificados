import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
chromium.use(StealthPlugin());
dotenv.config();

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx');
  
  await page.waitForTimeout(5000);
  
  const data = await page.evaluate(() => {
    const el = document.querySelector('#contenido_ddlMesIni');
    if (!el) return 'Element not found';
    return {
      tagName: el.tagName,
      isVisible: el.offsetWidth > 0 && el.offsetHeight > 0,
      opacity: window.getComputedStyle(el).opacity,
      display: window.getComputedStyle(el).display,
      options: Array.from(el.options).map(o => ({ value: o.value, text: o.text }))
    };
  });
  
  console.log('DEBUG DATA:', JSON.stringify(data, null, 2));
  await browser.close();
})();
