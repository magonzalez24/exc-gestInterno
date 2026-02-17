import { Router } from 'express';
import { empleadoController } from '../controllers';

const router = Router();

router.get('/', empleadoController.getAll.bind(empleadoController));
router.get('/codigo/:codigo', empleadoController.getByCodigo.bind(empleadoController));
router.get('/email/:email', empleadoController.getByEmail.bind(empleadoController));
router.get('/username/:username', empleadoController.getByUsername.bind(empleadoController));
router.get('/:id', empleadoController.getById.bind(empleadoController));
router.post('/', empleadoController.create.bind(empleadoController));
router.put('/:id', empleadoController.update.bind(empleadoController));
router.delete('/:id', empleadoController.delete.bind(empleadoController));

export default router;
