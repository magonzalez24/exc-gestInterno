import { Router } from 'express';
import { dimensionController } from '../controllers';

const router = Router();

router.get('/', dimensionController.getAll.bind(dimensionController));
router.get('/codigo/:codigo', dimensionController.getByCodigo.bind(dimensionController));
router.get('/:id', dimensionController.getById.bind(dimensionController));
router.post('/', dimensionController.create.bind(dimensionController));
router.put('/:id', dimensionController.update.bind(dimensionController));
router.delete('/:id', dimensionController.delete.bind(dimensionController));

export default router;
