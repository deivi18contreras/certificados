import express from 'express';
import { check, validationResult } from 'express-validator';
import { 
  getSupervisors, 
  registerSupervisor, 
  loginSupervisor, 
  getSupervisorProfile,
  getGoogleAuthUrl,
  googleCallback 
} from '../controllers/supervisorController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({ campo: err.path, mensaje: err.msg }))
    });
  }
  next();
};

router.get('/', getSupervisors);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty().trim(),
    check('email', 'Ingrese un correo electrónico válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('documento', 'El número de documento debe ser numérico').isNumeric(),
    validateRequest,
  ],
  registerSupervisor
);

router.post(
  '/login',
  [
    check('email', 'Ingrese un correo electrónico válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validateRequest,
  ],
  loginSupervisor
);

router.get('/profile', protect, getSupervisorProfile);

// Google Drive Auth - Ruta ajustada a GOOGLE_REDIRECT_URI del usuario
router.get('/google/auth/:id', getGoogleAuthUrl); 
router.get('/google/callback', googleCallback);

export default router;
