import express from 'express';
import { check, validationResult } from 'express-validator';
import { getReportes, registerReporte, getSupervisorDashboard } from '../controllers/reporteController.js';

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

// Rutas
router.get('/', getReportes);
router.get('/dashboard/:supervisorId', getSupervisorDashboard);

router.post(
  '/',
  [
    check('contratistaId', 'El ID del contratista es obligatorio').notEmpty().isMongoId(),
    check('supervisorId', 'El ID del supervisor es obligatorio').notEmpty().isMongoId(),
    check('entidadPagadora', 'El operador de pago es obligatorio').notEmpty(),
    check('mesPagado', 'El mes es obligatorio').notEmpty(),
    check('anio', 'El año es obligatorio').notEmpty(),
    validateRequest,
  ],
  registerReporte
);

export default router;
