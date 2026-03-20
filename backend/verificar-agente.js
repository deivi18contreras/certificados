import { downloadPlanilla } from './src/utils/scrapingService.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const testReporteSOI = {
  operadorPago: 'SOI',
  contratista: {
    numeroDocumento: '79794241',
    tipoDocumento: 'CC',
    eps: 'NUEVA EPS'
  },
  periodoPago: { mes: 'enero', anio: '2026' }
};

const testReporteCompensar = {
  operadorPago: 'Compensar MiPlanilla',
  contratista: {
    numeroDocumento: '37898093',
    tipoDocumento: 'CC'
  },
  periodoPago: { mes: 'enero', anio: '2026' },
  datosOperador: {
    numeroPlanilla: '50885037',
    valorPagado: '590900',
    fechaPago: '2026-02-13'
  }
};

const testReporteAsopagos = {
  operadorPago: 'Asopagos',
  contratista: {
    numeroDocumento: '1100952854',
    tipoDocumento: 'CC'
  },
  periodoPago: { mes: 'enero', anio: '2026' },
  datosOperador: {}
};

const testReporteAportes = {
  operadorPago: 'Aportes en linea',
  contratista: {
    numeroDocumento: '91075655',
    tipoDocumento: 'CC',
    expCedula: '1994-10-31',
    eps: 'Nueva EPS'
  },
  periodoPago: { mes: 'enero', anio: '2026' },
  datosOperador: {}
};

const runTest = async (reporte) => {
  try {
    console.log(`\n🧪 Probando Agente para: ${reporte.operadorPago}...`);
    const result = await downloadPlanilla(reporte);
    console.log(`✅ PRUEBA EXITOSA: ${reporte.operadorPago}`);
    console.log(`📂 Archivo guardado en: ${result}`);
  } catch (err) {
    console.error(`❌ ERROR en ${reporte.operadorPago}:`, err.message);
  }
};

const start = async () => {
  const operador = process.argv[2] || 'soi';

  if (operador.toLowerCase() === 'soi') {
    await runTest(testReporteSOI);
  } else if (operador.toLowerCase() === 'compensar') {
    await runTest(testReporteCompensar);
  } else if (operador.toLowerCase() === 'asopagos') {
    await runTest(testReporteAsopagos);
  } else if (operador.toLowerCase() === 'aportes') {
    await runTest(testReporteAportes);
  } else {
    console.log('Uso: node verificar-agente.js [soi|compensar|asopagos|aportes]');
  }
  process.exit(0);
};

start();
