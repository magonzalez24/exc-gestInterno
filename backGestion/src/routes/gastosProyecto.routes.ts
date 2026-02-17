import { Router } from 'express';
import { gastosProyectoController } from '../controllers';

const router = Router();

router.get('/', gastosProyectoController.getAll.bind(gastosProyectoController));
router.get('/:id', gastosProyectoController.getById.bind(gastosProyectoController));
router.post('/', gastosProyectoController.create.bind(gastosProyectoController));
router.put('/:id', gastosProyectoController.update.bind(gastosProyectoController));
router.delete('/:id', gastosProyectoController.delete.bind(gastosProyectoController));

export default router;
