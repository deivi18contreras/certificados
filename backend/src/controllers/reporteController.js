import Reporte from '../models/Reporte.js';
import Contratista from '../models/Contratista.js';

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

// @desc    Dashboard del Supervisor con Filtros
// @route   GET /api/reportes/dashboard
// @access  Private
export const getSupervisorDashboard = async (req, res, next) => {
  try {
    const { mes, anio, entidad, query } = req.query;
    const supervisorId = req.user._id;

    // Filtros base
    let filters = { supervisorId };

    if (mes) filters.mesPagado = mes;
    if (entidad) filters.entidadPagadora = entidad;
    
    // Filtro por año (usando el campo timestamps o fechaPago)
    if (anio) {
      const startOfYear = new Date(`${anio}-01-01`);
      const endOfYear = new Date(`${anio}-12-31T23:59:59`);
      filters.fechaPago = { $gte: startOfYear, $lte: endOfYear };
    }

    // Si hay una búsqueda por nombre, apellido o documento del contratista
    let contratistaQuery = {};
    if (query) {
      const isNumeric = !isNaN(query);
      if (isNumeric) {
        contratistaQuery = { numeroDoc: Number(query) };
      } else {
        contratistaQuery = {
          $or: [
            { nombres: { $regex: query, $options: 'i' } },
            { apellidos: { $regex: query, $options: 'i' } }
          ]
        };
      }

      // Buscar los IDs de los contratistas que coinciden
      const matchedContratistas = await Contratista.find(contratistaQuery).select('_id');
      const ids = matchedContratistas.map(c => c._id);
      filters.contratistaId = { $in: ids };
    }

    const reportes = await Reporte.find(filters)
      .populate('contratistaId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reportes.length,
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
      numPlanilla, 
      fechaPago, 
      valorPagado, 
      mesPagado, 
      contratistaId, 
      supervisorId, 
      entidadPagadora 
    } = req.body;

    const newReporte = await Reporte.create({
      numPlanilla,
      fechaPago,
      valorPagado,
      mesPagado,
      contratistaId,
      supervisorId,
      entidadPagadora
    });

    res.status(201).json({
      success: true,
      message: 'Reporte registrado exitosamente.',
      data: newReporte
    });
  } catch (error) {
    next(error);
  }
};
