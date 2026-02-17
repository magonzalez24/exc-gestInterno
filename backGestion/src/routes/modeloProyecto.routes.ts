import { Router } from 'express';
import { modeloProyectoController } from '../controllers';

const router = Router();

router.get('/', modeloProyectoController.getAll.bind(modeloProyectoController));
router.get('/codigo/:codigo', modeloProyectoController.getByCodigo.bind(modeloProyectoController));
router.get('/:id', modeloProyectoController.getById.bind(modeloProyectoController));
router.post('/', modeloProyectoController.create.bind(modeloProyectoController));
router.put('/:id', modeloProyectoController.update.bind(modeloProyectoController));
router.delete('/:id', modeloProyectoController.delete.bind(modeloProyectoController));

export default router;
