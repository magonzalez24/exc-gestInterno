import { Router } from 'express';
import { modeloContratacionController } from '../controllers';

const router = Router();

router.get('/', modeloContratacionController.getAll.bind(modeloContratacionController));
router.get('/codigo/:codigo', modeloContratacionController.getByCodigo.bind(modeloContratacionController));
router.get('/:id', modeloContratacionController.getById.bind(modeloContratacionController));
router.post('/', modeloContratacionController.create.bind(modeloContratacionController));
router.put('/:id', modeloContratacionController.update.bind(modeloContratacionController));
router.delete('/:id', modeloContratacionController.delete.bind(modeloContratacionController));

export default router;
