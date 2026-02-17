import { Request, Response } from 'express';
import { empleadoRolService } from '../services';
import { parseId } from '../utils/parseId';

export const empleadoRolController = {
  async getAll(req: Request, res: Response) {
    try {
      const include = req.query.include === 'relations'
        ? { empleado: true, rol: true }
        : undefined;
      const items = await empleadoRolService.findAll(undefined, include);
      res.json(items);
    } catch (error) {
      console.error('Error en empleadoRolController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener roles de empleados' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const include = req.query.include === 'relations'
        ? { empleado: true, rol: true }
        : undefined;
      const item = await empleadoRolService.findById(id, include);
      if (!item) {
        return res.status(404).json({ error: 'Rol de empleado no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en empleadoRolController.getById:', error);
      res.status(500).json({ error: 'Error al obtener rol de empleado' });
    }
  },

  async getByEmpleado(req: Request, res: Response) {
    try {
      const empleado_id = parseId(req.params.empleadoId);
      if (empleado_id === null) {
        return res.status(400).json({ error: 'ID de empleado inválido' });
      }
      const items = await empleadoRolService.findByEmpleado(empleado_id);
      res.json(items);
    } catch (error) {
      console.error('Error en empleadoRolController.getByEmpleado:', error);
      res.status(500).json({ error: 'Error al obtener roles del empleado' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await empleadoRolService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en empleadoRolController.create:', error);
      res.status(500).json({ error: 'Error al asignar rol a empleado' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await empleadoRolService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en empleadoRolController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar rol de empleado' });
    }
  },

  async deleteByEmpleadoAndRol(req: Request, res: Response) {
    try {
      const empleado_id = parseId(req.params.empleadoId);
      const rol_id = parseId(req.params.rolId);
      if (empleado_id === null || rol_id === null) {
        return res.status(400).json({ error: 'IDs inválidos' });
      }
      await empleadoRolService.deleteByEmpleadoAndRol(empleado_id, rol_id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en empleadoRolController.deleteByEmpleadoAndRol:', error);
      res.status(500).json({ error: 'Error al eliminar rol de empleado' });
    }
  },
};
