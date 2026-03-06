import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Supervisor from '../models/Supervisor.js';

// Helper para generar el Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
    expiresIn: '30d',
  });
};

// @desc    Obtener lista de supervisores
// @route   GET /api/supervisors
// @access  Public
export const getSupervisors = async (req, res, next) => {
  try {
    const supervisors = await Supervisor.find().select('-password');
    res.status(200).json({
      success: true,
      data: supervisors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Registrar un nuevo supervisor
// @route   POST /api/supervisors
// @access  Public
export const registerSupervisor = async (req, res, next) => {
  try {
    const { nombre, email, password, documento } = req.body;

    const existingSupervisor = await Supervisor.findOne({ $or: [{ email }, { documento }] });
    if (existingSupervisor) {
      const error = new Error('El correo o el documento ya están registrados');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newSupervisor = await Supervisor.create({
      nombre,
      email,
      password: hashedPassword,
      documento
    });

    const supervisorData = newSupervisor.toObject();
    delete supervisorData.password;

    res.status(201).json({
      success: true,
      token: generateToken(newSupervisor._id),
      data: supervisorData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Autenticar supervisor y obtener token (Login)
// @route   POST /api/supervisors/login
// @access  Public
export const loginSupervisor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar el supervisor por email
    const supervisor = await Supervisor.findOne({ email });

    if (supervisor && (await bcrypt.compare(password, supervisor.password))) {
      res.status(200).json({
        success: true,
        token: generateToken(supervisor._id),
        data: {
          id: supervisor._id,
          nombre: supervisor.nombre,
          email: supervisor.email,
          documento: supervisor.documento
        }
      });
    } else {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener perfil del supervisor autenticado
// @route   GET /api/supervisors/profile
// @access  Private
export const getSupervisorProfile = async (req, res, next) => {
  try {
    const supervisor = await Supervisor.findById(req.user.id).select('-password');
    if (supervisor) {
      res.status(200).json({
        success: true,
        data: supervisor
      });
    } else {
      const error = new Error('Supervisor no encontrado');
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
