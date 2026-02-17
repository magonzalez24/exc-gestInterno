import { Router } from 'express';
import { rolProyectoController } from '../controllers';

const router = Router();

router.get('/', rolProyectoController.getAll.bind(rolProyectoController));
router.get('/codigo/:codigo', rolProyectoController.getByCodigo.bind(rolProyectoController));
router.get('/:id', rolProyectoController.getById.bind(rolProyectoController));
router.post('/', rolProyectoController.create.bind(rolProyectoController));
router.put('/:id', rolProyectoController.update.bind(rolProyectoController));
router.delete('/:id', rolProyectoController.delete.bind(rolProyectoController));

export default router;
