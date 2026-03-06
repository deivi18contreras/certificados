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
    const { nombres, apellidos, tipoDoc, numeroDoc, eps, expCedula } = req.body;

    const existingContratista = await Contratista.findOne({ numeroDoc });
    if (existingContratista) {
      const error = new Error('El contratista con este número de documento ya existe');
      error.statusCode = 400;
      throw error;
    }

    const newContratista = await Contratista.create({
      nombres,
      apellidos,
      tipoDoc,
      numeroDoc,
      eps,
      expCedula
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
// @access  Private (Se protegerá en las rutas)
export const updateContratista = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, tipoDoc, numeroDoc, eps, expCedula } = req.body;

    const contratista = await Contratista.findById(id);

    if (!contratista) {
      const error = new Error('Contratista no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Actualizar campos
    contratista.nombres = nombres || contratista.nombres;
    contratista.apellidos = apellidos || contratista.apellidos;
    contratista.tipoDoc = tipoDoc || contratista.tipoDoc;
    contratista.numeroDoc = numeroDoc || contratista.numeroDoc;
    contratista.eps = eps || contratista.eps;
    contratista.expCedula = expCedula || contratista.expCedula;

    const updatedContratista = await contratista.save();

    res.status(200).json({
      success: true,
      data: updatedContratista
    });
  } catch (error) {
    next(error);
  }
};
