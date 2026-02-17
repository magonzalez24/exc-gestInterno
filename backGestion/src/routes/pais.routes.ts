import { Router } from 'express';
import { paisController } from '../controllers';

const router = Router();

router.get('/', paisController.getAll.bind(paisController));
router.get('/codigo/:codigo', paisController.getByCodigo.bind(paisController));
router.get('/:id', paisController.getById.bind(paisController));
router.post('/', paisController.create.bind(paisController));
router.put('/:id', paisController.update.bind(paisController));
router.delete('/:id', paisController.delete.bind(paisController));

export default router;
