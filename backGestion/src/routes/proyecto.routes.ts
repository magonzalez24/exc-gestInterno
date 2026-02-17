import { Router } from 'express';
import { proyectoController, asignacionProyectoEmpleadoController, gastosProyectoController, ingresosProyectoController } from '../controllers';

const router = Router();

router.get('/', proyectoController.getAll.bind(proyectoController));
router.get('/codigo/:codigo', proyectoController.getByCodigo.bind(proyectoController));
router.get('/:id', proyectoController.getById.bind(proyectoController));
router.get('/:proyectoId/asignaciones', asignacionProyectoEmpleadoController.getByProyecto.bind(asignacionProyectoEmpleadoController));
router.get('/:proyectoId/gastos', gastosProyectoController.getByProyecto.bind(gastosProyectoController));
router.get('/:proyectoId/ingresos', ingresosProyectoController.getByProyecto.bind(ingresosProyectoController));
router.post('/', proyectoController.create.bind(proyectoController));
router.put('/:id', proyectoController.update.bind(proyectoController));
router.delete('/:id', proyectoController.delete.bind(proyectoController));

export default router;
