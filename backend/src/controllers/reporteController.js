import Reporte from '../models/Reporte.js';
import Contratista from '../models/Contratista.js';
import Supervisor from '../models/Supervisor.js';
<<<<<<< HEAD
=======
import { processSingleReport } from '../utils/reportProcessor.js';
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c

// @desc    Obtener todos los reportes
// @route   GET /api/reportes
// @access  Public
export const getReportes = async (req, res, next) => {
  try {
    const reportes = await Reporte.find()
<<<<<<< HEAD
      .populate('contratista', 'nombres apellidos numeroDocumento')
=======
      .populate('contratista')
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
      .populate('supervisor', 'nombre email');
    
    res.status(200).json({
      success: true,
      data: reportes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener Dashboard de un supervisor
// @route   GET /api/reportes/dashboard/:supervisorId
// @access  Public
export const getSupervisorDashboard = async (req, res, next) => {
  try {
    const { supervisorId } = req.params;
    const reportes = await Reporte.find({ supervisor: supervisorId })
      .populate('contratista')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reportes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Registrar un nuevo reporte (Contratista)
// @route   POST /api/reportes
// @access  Public
export const registerReporte = async (req, res, next) => {
  try {
    const { 
      contratistaId, 
      supervisorId, 
<<<<<<< HEAD
      operadorPago,
      periodoPago,
      datosOperador 
    } = req.body;

    // Verificar que existen
    const contratista = await Contratista.findById(contratistaId);
    if (!contratista) {
      return res.status(404).json({ success: false, message: 'Contratista no encontrado' });
    }

    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    }

    // Crear el registro en la DB
    const newReporte = await Reporte.create({
      contratista: contratistaId,
      supervisor: supervisorId,
      operadorPago,
      periodoPago,
      datosOperador,
      status: 'Pendiente'
    });

    res.status(201).json({
      success: true,
      message: 'Reporte registrado exitosamente. El robot procesará su solicitud en unos minutos.',
=======
      entidadPagadora, 
      mesPagado,
      anio,
      numPlanilla,
      valorPagado,
      fechaPago
    } = req.body;

    const mapOperadores = {
      'aportesenlinea': 'Aportes en Línea',
      'compensar': 'Compensar MiPlanilla',
      'soi': 'SOI',
      'asopagos': 'Asopagos',
      'enlace-apb': 'Enlace-APB'
    };

    const operadorFinal = mapOperadores[entidadPagadora.toLowerCase()] || entidadPagadora;

    const contratista = await Contratista.findById(contratistaId);
    if (!contratista) return res.status(404).json({ success: false, message: 'Contratista no encontrado' });

    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });

    const newReporte = await Reporte.create({
      contratista: contratistaId,
      supervisor: supervisorId,
      operadorPago: operadorFinal,
      periodoPago: { mes: mesPagado, anio: anio.toString() },
      datosOperador: {
        numeroPlanilla: numPlanilla,
        valorPagado: valorPagado,
        fechaPago: fechaPago
      },
      status: 'Pendiente'
    });

    // DISPARAR EL PROCESO INMEDIATAMENTE
    console.log(`🚀 [Reporte] Iniciando proceso inmediato para ${newReporte._id}`);
    
    processSingleReport(newReporte._id).catch(err => {
        console.error(`❌ Error en el proceso inmediato de reporte ${newReporte._id}:`, err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Reporte registrado y proceso de descarga iniciado.',
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
      data: newReporte
    });
  } catch (error) {
    next(error);
  }
};
