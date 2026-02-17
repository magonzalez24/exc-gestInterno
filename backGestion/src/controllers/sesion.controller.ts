import { Request, Response } from 'express';
import { sesionService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const sesionController = {
  async getAll(req: Request, res: Response) {
    try {
      const items = await sesionService.findAll();
      res.json(items);
    } catch (error) {
      console.error('Error en sesionController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener sesiones' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await sesionService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Sesión no encontrada' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en sesionController.getById:', error);
      res.status(500).json({ error: 'Error al obtener sesión' });
    }
  },

  async getByToken(req: Request, res: Response) {
    try {
      const token = getParam(req.params.token);
      if (!token) {
        return res.status(400).json({ error: 'Token requerido' });
      }
      const item = await sesionService.findByToken(token);
      if (!item) {
        return res.status(404).json({ error: 'Sesión no encontrada' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en sesionController.getByToken:', error);
      res.status(500).json({ error: 'Error al obtener sesión' });
    }
  },

  async getByEmpleado(req: Request, res: Response) {
    try {
      const empleado_id = parseId(req.params.empleadoId);
      if (empleado_id === null) {
        return res.status(400).json({ error: 'ID de empleado inválido' });
      }
      const items = await sesionService.findByEmpleado(empleado_id);
      res.json(items);
    } catch (error) {
      console.error('Error en sesionController.getByEmpleado:', error);
      res.status(500).json({ error: 'Error al obtener sesiones del empleado' });
    }
  },

  async getActivasByEmpleado(req: Request, res: Response) {
    try {
      const empleado_id = parseId(req.params.empleadoId);
      if (empleado_id === null) {
        return res.status(400).json({ error: 'ID de empleado inválido' });
      }
      const items = await sesionService.findActivasByEmpleado(empleado_id);
      res.json(items);
    } catch (error) {
      console.error('Error en sesionController.getActivasByEmpleado:', error);
      res.status(500).json({ error: 'Error al obtener sesiones activas' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await sesionService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en sesionController.create:', error);
      res.status(500).json({ error: 'Error al crear sesión' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await sesionService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en sesionController.update:', error);
      res.status(500).json({ error: 'Error al actualizar sesión' });
    }
  },

  async invalidar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await sesionService.invalidar(id);
      res.json(item);
    } catch (error) {
      console.error('Error en sesionController.invalidar:', error);
      res.status(500).json({ error: 'Error al invalidar sesión' });
    }
  },

  async invalidarPorToken(req: Request, res: Response) {
    try {
      const token = getParam(req.params.token);
      if (!token) {
        return res.status(400).json({ error: 'Token requerido' });
      }
      const item = await sesionService.invalidarPorToken(token);
      res.json(item);
    } catch (error) {
      console.error('Error en sesionController.invalidarPorToken:', error);
      res.status(500).json({ error: 'Error al invalidar sesión' });
    }
  },

  async invalidarTodasEmpleado(req: Request, res: Response) {
    try {
      const empleado_id = parseId(req.params.empleadoId);
      if (empleado_id === null) {
        return res.status(400).json({ error: 'ID de empleado inválido' });
      }
      const result = await sesionService.invalidarTodasEmpleado(empleado_id);
      res.json(result);
    } catch (error) {
      console.error('Error en sesionController.invalidarTodasEmpleado:', error);
      res.status(500).json({ error: 'Error al invalidar sesiones' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await sesionService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en sesionController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar sesión' });
    }
  },
};
