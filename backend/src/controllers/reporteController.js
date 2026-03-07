import Reporte from '../models/Reporte.js';
import Contratista from '../models/Contratista.js';
import { downloadPlanilla } from '../utils/scrapingService.js';
import { uploadPlanillaToDrive } from '../utils/driveService.js';

// @desc    Obtener todos los reportes (General)
// @route   GET /api/reportes
// @access  Public
export const getReportes = async (req, res, next) => {
  try {
    const reportes = await Reporte.find()
      .populate('contratistaId', 'nombres apellidos numeroDoc')
      .populate('supervisorId', 'nombre email');
    
    res.status(200).json({
      success: true,
      data: reportes
    });
  } catch (error) {
    next(error);
  }
};

// ... (getSupervisorDashboard remains same)

// @desc    Registrar un nuevo reporte (Contratista)
// @route   POST /api/reportes
// @access  Public
export const registerReporte = async (req, res, next) => {
  try {
    const { 
      numPlanilla, 
      fechaPago, 
      valorPagado, 
      mesPagado, 
      contratistaId, 
      supervisorId, 
      entidadPagadora 
    } = req.body;

    // 1. Crear el registro en la DB
    const newReporte = await Reporte.create({
      numPlanilla,
      fechaPago,
      valorPagado,
      mesPagado,
      contratistaId,
      supervisorId,
      entidadPagadora
    });

    // 2. Ejecutar procesos en segundo plano (Scraping y Drive)
    // No usamos 'await' aquí para que la respuesta al cliente sea rápida, 
    // pero manejamos errores internamente.
    (async () => {
      try {
        const contratista = await Contratista.findById(contratistaId);
        if (!contratista) return;

        console.log(`Iniciando proceso para: ${contratista.nombres} ${contratista.apellidos}`);

        // Simulación o ejecución de descarga
        // Asegúrate de pasar datos suficientes para el scraper
        const localPath = await downloadPlanilla({
          entidadPagadora,
          contratista: {
            tipoDoc: contratista.tipoDoc,
            numDocumento: contratista.numeroDoc,
            expCedula: contratista.expCedula
          },
          numPlanilla,
          fechaPago,
          valorPagado,
          mesPagado
        });

        // Subida a Drive
        const year = new Date(fechaPago).getFullYear();
        await uploadPlanillaToDrive(localPath, `Planilla_${numPlanilla}.pdf`, {
          year,
          month: mesPagado,
          contractorName: `${contratista.nombres} ${contratista.apellidos}`
        });

        console.log('Proceso de automatización completado con éxito.');
      } catch (err) {
        console.error('Error en el proceso de automatización:', err.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Reporte registrado exitosamente. El proceso de descarga y subida a Drive se ha iniciado en segundo plano.',
      data: newReporte
    });
  } catch (error) {
    next(error);
  }
};
