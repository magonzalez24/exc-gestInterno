import { Router } from 'express';
import { rolController } from '../controllers';

const router = Router();

router.get('/', rolController.getAll.bind(rolController));
router.get('/codigo/:codigo', rolController.getByCodigo.bind(rolController));
router.get('/:id', rolController.getById.bind(rolController));
router.post('/', rolController.create.bind(rolController));
router.put('/:id', rolController.update.bind(rolController));
router.delete('/:id', rolController.delete.bind(rolController));

export default router;
