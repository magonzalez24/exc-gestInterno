import { Router } from 'express';
import { horasSemanaEmpleadoController } from '../controllers';

const router = Router();

router.get('/', horasSemanaEmpleadoController.getAll.bind(horasSemanaEmpleadoController));
router.get('/year/:year/semana/:semanaNumero', horasSemanaEmpleadoController.getByYearAndSemana.bind(horasSemanaEmpleadoController));
router.get('/:id', horasSemanaEmpleadoController.getById.bind(horasSemanaEmpleadoController));
router.post('/', horasSemanaEmpleadoController.create.bind(horasSemanaEmpleadoController));
router.put('/:id', horasSemanaEmpleadoController.update.bind(horasSemanaEmpleadoController));
router.delete('/:id', horasSemanaEmpleadoController.delete.bind(horasSemanaEmpleadoController));

export default router;
