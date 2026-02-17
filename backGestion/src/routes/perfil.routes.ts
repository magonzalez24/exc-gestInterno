import { Router } from 'express';
import { perfilController } from '../controllers';

const router = Router();

router.get('/', perfilController.getAll.bind(perfilController));
router.get('/codigo/:codigo', perfilController.getByCodigo.bind(perfilController));
router.get('/:id', perfilController.getById.bind(perfilController));
router.post('/', perfilController.create.bind(perfilController));
router.put('/:id', perfilController.update.bind(perfilController));
router.delete('/:id', perfilController.delete.bind(perfilController));

export default router;
