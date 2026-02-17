import { Router } from 'express';
import { sesionController } from '../controllers';

const router = Router();

router.get('/', sesionController.getAll.bind(sesionController));
router.get('/token/:token', sesionController.getByToken.bind(sesionController));
router.get('/empleado/:empleadoId', sesionController.getByEmpleado.bind(sesionController));
router.get('/empleado/:empleadoId/activas', sesionController.getActivasByEmpleado.bind(sesionController));
router.get('/:id', sesionController.getById.bind(sesionController));
router.post('/', sesionController.create.bind(sesionController));
router.put('/:id/invalidar', sesionController.invalidar.bind(sesionController));
router.put('/:id', sesionController.update.bind(sesionController));
router.put('/token/:token/invalidar', sesionController.invalidarPorToken.bind(sesionController));
router.put('/empleado/:empleadoId/invalidar-todas', sesionController.invalidarTodasEmpleado.bind(sesionController));
router.delete('/:id', sesionController.delete.bind(sesionController));

export default router;
