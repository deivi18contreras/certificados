import Contratista from '../models/Contratista.js';

// @desc    Obtener lista de contratistas
// @route   GET /api/contratistas
// @access  Public
export const getContratistas = async (req, res, next) => {
  try {
    const contratistas = await Contratista.find();
    res.status(200).json({
      success: true,
      data: contratistas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Registrar un nuevo contratista
// @route   POST /api/contratistas
// @access  Public
export const registerContratista = async (req, res, next) => {
  try {
    const { 
      nombres, 
      apellidos, 
      tipoDoc, // Del front
      numeroDoc, // Del front
      eps, 
      expCedula // Del front
    } = req.body;

    const tipoDocumento = tipoDoc;
    const numeroDocumento = numeroDoc;
    const fechaExpedicion = expCedula;

    const existingContratista = await Contratista.findOne({ numeroDocumento });
    if (existingContratista) {
      return res.status(400).json({
        success: false,
        message: 'El contratista con este número de documento ya existe',
        data: existingContratista // Devolver el existente para que el front lo use
      });
    }

    const newContratista = await Contratista.create({
      nombres,
      apellidos,
      tipoDocumento,
      numeroDocumento,
      eps,
      fechaExpedicion
    });

    res.status(201).json({
      success: true,
      data: newContratista
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar un contratista
// @route   PUT /api/contratistas/:id
// @access  Private
export const updateContratista = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      nombres, 
      apellidos, 
      tipoDocumento, 
      numeroDocumento, 
      eps, 
      fechaExpedicion 
    } = req.body;

    const contratista = await Contratista.findById(id);

    if (!contratista) {
      return res.status(404).json({ success: false, message: 'Contratista no encontrado' });
    }

    // Actualizar campos
    contratista.nombres = nombres || contratista.nombres;
    contratista.apellidos = apellidos || contratista.apellidos;
    contratista.tipoDocumento = tipoDocumento || contratista.tipoDocumento;
    contratista.numeroDocumento = numeroDocumento || contratista.numeroDocumento;
    contratista.eps = eps || contratista.eps;
    contratista.fechaExpedicion = fechaExpedicion || contratista.fechaExpedicion;

    const updatedContratista = await contratista.save();

    res.status(200).json({
      success: true,
      data: updatedContratista
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener contratista por número de documento
// @route   GET /api/contratistas/documento/:numeroDocumento
// @access  Public
export const getContratistaByDocumento = async (req, res, next) => {
  try {
    const { numeroDocumento } = req.params;
    const contratista = await Contratista.findOne({ numeroDocumento });

    if (!contratista) {
      return res.status(404).json({
        success: false,
        message: 'Contratista no encontrado con ese número de documento'
      });
    }

    res.status(200).json({
      success: true,
      data: contratista
    });
  } catch (error) {
    next(error);
  }
};
