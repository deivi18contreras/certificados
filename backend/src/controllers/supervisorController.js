import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Supervisor from '../models/Supervisor.js';
import { google } from 'googleapis';

// Configuración de Google OAuth2 con nombres de variables actualizados
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
    expiresIn: '30d',
  });
};

export const getSupervisors = async (req, res, next) => {
  try {
    const supervisors = await Supervisor.find().select('-password');
    res.status(200).json(supervisors);
  } catch (error) {
    next(error);
  }
};

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

    res.status(201).json({
      token: generateToken(newSupervisor._id),
      supervisor: { id: newSupervisor._id, nombre: newSupervisor.nombre }
    });
  } catch (error) {
    next(error);
  }
};

export const loginSupervisor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const supervisor = await Supervisor.findOne({ email });

    if (supervisor && (await bcrypt.compare(password, supervisor.password))) {
      res.status(200).json({
        token: generateToken(supervisor._id),
        supervisor: { id: supervisor._id, nombre: supervisor.nombre, email: supervisor.email }
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

export const getSupervisorProfile = async (req, res, next) => {
  try {
    const supervisor = await Supervisor.findById(req.user.id).select('-password');
    res.status(200).json(supervisor);
  } catch (error) {
    next(error);
  }
};

export const getGoogleAuthUrl = async (req, res) => {
    const { id } = req.params;
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // Para asegurar que recibimos el refresh_token
      scope: ['https://www.googleapis.com/auth/drive.file'],
      state: id
    });
    res.json({ url });
};

export const googleCallback = async (req, res, next) => {
    const { code, state: supervisorId } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      await Supervisor.findByIdAndUpdate(supervisorId, {
        googleTokens: tokens
      });
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/dashboard?drive=success`);
    } catch (error) {
      console.error('Error en callback de Google:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?drive=error`);
    }
};
