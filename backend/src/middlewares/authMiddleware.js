import jwt from 'jsonwebtoken';
import Supervisor from '../models/Supervisor.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener el token del header Bearer [Token]
      token = req.headers.authorization.split(' ')[1];

      // Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');

      // Buscar el supervisor asociado al token y adjuntarlo al objeto req
      req.user = await Supervisor.findById(decoded.id).select('-password');

      if (!req.user) {
        const error = new Error('No autorizado, usuario no encontrado');
        error.statusCode = 401;
        throw error;
      }

      next();
    } catch (err) {
      console.error('*** Error en autenticación:', err.message);
      res.status(401).json({
        success: false,
        message: 'No autorizado, token fallido',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'No autorizado, no se proporcionó token',
    });
  }
};

export default protect;
