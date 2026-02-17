import { Router } from 'express';
import { asignacionProyectoEmpleadoController, horasSemanaEmpleadoController } from '../controllers';

const router = Router();

router.get('/', asignacionProyectoEmpleadoController.getAll.bind(asignacionProyectoEmpleadoController));
router.get('/codigo/:codigo', asignacionProyectoEmpleadoController.getByCodigo.bind(asignacionProyectoEmpleadoController));
router.get('/empleado/:empleadoId', asignacionProyectoEmpleadoController.getByEmpleado.bind(asignacionProyectoEmpleadoController));
router.get('/finalizaciones', asignacionProyectoEmpleadoController.getFinalizaciones.bind(asignacionProyectoEmpleadoController));
router.get('/:id', asignacionProyectoEmpleadoController.getById.bind(asignacionProyectoEmpleadoController));
router.get('/:asignacionId/horas', horasSemanaEmpleadoController.getByAsignacion.bind(horasSemanaEmpleadoController));
router.post('/', asignacionProyectoEmpleadoController.create.bind(asignacionProyectoEmpleadoController));
router.put('/:id', asignacionProyectoEmpleadoController.update.bind(asignacionProyectoEmpleadoController));
router.delete('/:id', asignacionProyectoEmpleadoController.delete.bind(asignacionProyectoEmpleadoController));

export default router;
