import { Request, Response } from 'express';
import { asignacionProyectoEmpleadoService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const asignacionProyectoEmpleadoController = {
  async getAll(req: Request, res: Response) {
    try {
      const include = req.query.include === 'relations'
        ? { empleado: true, proyecto: true, rol_proyecto: true }
        : undefined;
      const items = await asignacionProyectoEmpleadoService.findAll(undefined, include);
      res.json(items);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const include = req.query.include === 'relations'
        ? { empleado: true, proyecto: true, rol_proyecto: true }
        : undefined;
      const item = await asignacionProyectoEmpleadoService.findById(id, include);
      if (!item) {
        return res.status(404).json({ error: 'Asignación no encontrada' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener asignación' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await asignacionProyectoEmpleadoService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Asignación no encontrada' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener asignación' });
    }
  },

  async getByProyecto(req: Request, res: Response) {
    try {
      const proyecto_id = parseId(req.params.proyectoId);
      if (proyecto_id === null) {
        return res.status(400).json({ error: 'ID de proyecto inválido' });
      }
      const items = await asignacionProyectoEmpleadoService.findByProyecto(proyecto_id);
      res.json(items);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.getByProyecto:', error);
      res.status(500).json({ error: 'Error al obtener asignaciones del proyecto' });
    }
  },

  async getByEmpleado(req: Request, res: Response) {
    try {
      const empleado_id = parseId(req.params.empleadoId);
      if (empleado_id === null) {
        return res.status(400).json({ error: 'ID de empleado inválido' });
      }
      const items = await asignacionProyectoEmpleadoService.findByEmpleado(empleado_id);
      res.json(items);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.getByEmpleado:', error);
      res.status(500).json({ error: 'Error al obtener asignaciones del empleado' });
    }
  },

  async getFinalizaciones(req: Request, res: Response) {
    try {
      // Permitimos sobreescribir el número de meses vía query (?months=3), por defecto 2
      const monthsParam = req.query.months;
      const months =
        typeof monthsParam === 'string' && !Number.isNaN(Number(monthsParam))
          ? Number(monthsParam)
          : 2;

      const items = await asignacionProyectoEmpleadoService.findWithFechaFinInNextMonths(months);
      res.json(items);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.getFinalizaciones:', error);
      res.status(500).json({ error: 'Error al obtener asignaciones con fecha fin próxima' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await asignacionProyectoEmpleadoService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.create:', error);
      res.status(500).json({ error: 'Error al crear asignación' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await asignacionProyectoEmpleadoService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar asignación' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await asignacionProyectoEmpleadoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en asignacionProyectoEmpleadoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar asignación' });
    }
  },
};
