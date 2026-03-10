import Reporte from '../models/Reporte.js';
import Contratista from '../models/Contratista.js';
import Supervisor from '../models/Supervisor.js';

// @desc    Obtener todos los reportes
// @route   GET /api/reportes
// @access  Public
export const getReportes = async (req, res, next) => {
  try {
    const reportes = await Reporte.find()
      .populate('contratista')
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
      entidadPagadora, // Viene del front como entidadPagadora
      mesPagado,
      anio,
      numPlanilla,
      valorPagado,
      fechaPago
    } = req.body;

    // Mapeo de operador para que coincida con el enum del backend
    const mapOperadores = {
      'aportesenlinea': 'Aportes en Línea',
      'compensar': 'Compensar MiPlanilla',
      'soi': 'SOI',
      'asopagos': 'Asopagos',
      'enlace-apb': 'Enlace-APB'
    };

    const operadorFinal = mapOperadores[entidadPagadora.toLowerCase()] || entidadPagadora;

    // Verificar que existen
    const contratista = await Contratista.findById(contratistaId);
    if (!contratista) {
      return res.status(404).json({ success: false, message: 'Contratista no encontrado' });
    }

    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    }

    // Crear el registro en la DB con la estructura del modelo
    const newReporte = await Reporte.create({
      contratista: contratistaId,
      supervisor: supervisorId,
      operadorPago: operadorFinal,
      periodoPago: { 
        mes: mesPagado, 
        anio: anio.toString() 
      },
      datosOperador: {
        numeroPlanilla: numPlanilla,
        valorPagado: valorPagado,
        fechaPago: fechaPago
      },
      status: 'Pendiente'
    });

    res.status(201).json({
      success: true,
      message: 'Reporte registrado exitosamente. El robot procesará su solicitud en unos minutos.',
      data: newReporte
    });
  } catch (error) {
    next(error);
  }
};
