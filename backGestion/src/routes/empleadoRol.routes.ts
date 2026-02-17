import { Router } from 'express';
import { empleadoRolController } from '../controllers';

const router = Router();

router.get('/', empleadoRolController.getAll.bind(empleadoRolController));
router.get('/empleado/:empleadoId', empleadoRolController.getByEmpleado.bind(empleadoRolController));
router.get('/:id', empleadoRolController.getById.bind(empleadoRolController));
router.post('/', empleadoRolController.create.bind(empleadoRolController));
router.delete('/:id', empleadoRolController.delete.bind(empleadoRolController));
router.delete('/empleado/:empleadoId/rol/:rolId', empleadoRolController.deleteByEmpleadoAndRol.bind(empleadoRolController));

export default router;
