import express from 'express';
import { check, validationResult } from 'express-validator';
import { 
  getContratistas, 
  registerContratista, 
  updateContratista,
  getContratistaByDocumento
} from '../controllers/contratistaController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

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

// Rutas Públicas (Registro por el contratista)
router.get('/', getContratistas);
router.get('/documento/:numeroDocumento', getContratistaByDocumento);

router.post(
  '/',
  [
    check('nombres', 'El nombre es obligatorio').notEmpty().trim(),
    check('apellidos', 'El apellido es obligatorio').notEmpty().trim(),
<<<<<<< HEAD
    check('tipoDocumento', 'El tipo de documento es obligatorio').notEmpty(),
    check('numeroDocumento', 'El número de documento debe ser numérico').isNumeric(),
=======
    check('tipoDoc', 'El tipo de documento es obligatorio').notEmpty(),
    check('numeroDoc', 'El número de documento debe ser numérico').notEmpty(),
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
    check('eps', 'La EPS es obligatoria').notEmpty().trim(),
    validateRequest,
  ],
  registerContratista
);

// Rutas Privadas (Gestión por el supervisor)
router.put('/:id', protect, updateContratista);

export default router;
