import { Router } from 'express';
import { ingresosProyectoController } from '../controllers';

const router = Router();

router.get('/', ingresosProyectoController.getAll.bind(ingresosProyectoController));
router.get('/:id', ingresosProyectoController.getById.bind(ingresosProyectoController));
router.post('/', ingresosProyectoController.create.bind(ingresosProyectoController));
router.put('/:id', ingresosProyectoController.update.bind(ingresosProyectoController));
router.delete('/:id', ingresosProyectoController.delete.bind(ingresosProyectoController));

export default router;
