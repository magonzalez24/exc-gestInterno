import { Router } from 'express';
import paisRoutes from './pais.routes';
import dimensionRoutes from './dimension.routes';
import perfilRoutes from './perfil.routes';
import modeloContratacionRoutes from './modeloContratacion.routes';
import modeloProyectoRoutes from './modeloProyecto.routes';
import rolRoutes from './rol.routes';
import rolProyectoRoutes from './rolProyecto.routes';
import empleadoRoutes from './empleado.routes';
import proyectoRoutes from './proyecto.routes';
import asignacionProyectoEmpleadoRoutes from './asignacionProyectoEmpleado.routes';
import empleadoRolRoutes from './empleadoRol.routes';
import gastosProyectoRoutes from './gastosProyecto.routes';
import ingresosProyectoRoutes from './ingresosProyecto.routes';
import horasSemanaEmpleadoRoutes from './horasSemanaEmpleado.routes';
import sesionRoutes from './sesion.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/paises', paisRoutes);
router.use('/dimensiones', dimensionRoutes);
router.use('/perfiles', perfilRoutes);
router.use('/modelos-contratacion', modeloContratacionRoutes);
router.use('/modelos-proyecto', modeloProyectoRoutes);
router.use('/roles', rolRoutes);
router.use('/roles-proyecto', rolProyectoRoutes);
router.use('/empleados', empleadoRoutes);
router.use('/proyectos', proyectoRoutes);
router.use('/asignaciones', asignacionProyectoEmpleadoRoutes);
router.use('/empleados-roles', empleadoRolRoutes);
router.use('/gastos-proyecto', gastosProyectoRoutes);
router.use('/ingresos-proyecto', ingresosProyectoRoutes);
router.use('/horas-semana', horasSemanaEmpleadoRoutes);
router.use('/sesiones', sesionRoutes);

export default router;
