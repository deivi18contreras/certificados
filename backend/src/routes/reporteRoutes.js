import express from 'express';
import { check, validationResult } from 'express-validator';
import { getReportes, registerReporte } from '../controllers/reporteController.js';

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

router.post(
  '/',
  [
    check('numPlanilla', 'El número de planilla debe ser numérico').isNumeric(),
    check('mesPagado', 'El mes pagado debe ser válido').isIn([
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]),
    check('contratistaId', 'El ID del contratista es obligatorio').notEmpty().isMongoId(),
    check('supervisorId', 'El ID del supervisor es obligatorio').notEmpty().isMongoId(),
    check('entidadPagadora', 'La entidad pagadora es obligatoria').isIn(['asopagos', 'soi', 'compensar', 'aportesEnLinea']),
    validateRequest,
  ],
  registerReporte
);

export default router;
