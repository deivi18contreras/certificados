import express from 'express';
import { check, validationResult } from 'express-validator';
import { 
  getSupervisors, 
  registerSupervisor, 
  loginSupervisor, 
  getSupervisorProfile 
} from '../controllers/supervisorController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware para manejar errores de validación
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        campo: err.path,
        mensaje: err.msg,
      })),
    });
  }
  next();
};

// Rutas Públicas
router.get('/', getSupervisors);

// Ruta provisional para crear un supervisor de prueba rápidamente
router.get('/test-create', async (req, res, next) => {
  try {
    req.body = {
      nombre: "Supervisor de Prueba",
      email: `test${Math.floor(Math.random() * 1000)}@correo.com`,
      password: "password123",
      documento: Math.floor(Math.random() * 1000000000)
    };
    await registerSupervisor(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty().trim(),
    check('email', 'Ingrese un correo electrónico válido').isEmail().normalizeEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('documento', 'El número de documento debe ser numérico').isNumeric(),
    validateRequest,
  ],
  registerSupervisor
);

router.post(
  '/login',
  [
    check('email', 'Ingrese un correo electrónico válido').isEmail().normalizeEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validateRequest,
  ],
  loginSupervisor
);

// Rutas Privadas
router.get('/profile', protect, getSupervisorProfile);

export default router;
