import { Request, Response } from 'express';
import { horasSemanaEmpleadoService } from '../services';
import { parseId } from '../utils/parseId';

export const horasSemanaEmpleadoController = {
  async getAll(req: Request, res: Response) {
    try {
      const asignacion_proyecto_id = req.query.asignacion_proyecto_id
        ? parseId(String(req.query.asignacion_proyecto_id))
        : undefined;
      const where = asignacion_proyecto_id !== undefined && asignacion_proyecto_id !== null
        ? { asignacion_proyecto_id }
        : undefined;
      const items = await horasSemanaEmpleadoService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en horasSemanaEmpleadoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener horas' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await horasSemanaEmpleadoService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Registro de horas no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en horasSemanaEmpleadoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener registro de horas' });
    }
  },

  async getByAsignacion(req: Request, res: Response) {
    try {
      const asignacion_proyecto_id = parseId(req.params.asignacionId);
      if (asignacion_proyecto_id === null) {
        return res.status(400).json({ error: 'ID de asignación inválido' });
      }
      const items = await horasSemanaEmpleadoService.findByAsignacion(asignacion_proyecto_id);
      res.json(items);
    } catch (error) {
      console.error('Error en horasSemanaEmpleadoController.getByAsignacion:', error);
      res.status(500).json({ error: 'Error al obtener horas de la asignación' });
    }
  },

  async getByYearAndSemana(req: Request, res: Response) {
    try {
      const year = parseId(req.params.year);
      const semana_numero = parseId(req.params.semanaNumero);
      if (year === null || semana_numero === null) {
        return res.status(400).json({ error: 'Año o número de semana inválidos' });
      }
      const items = await horasSemanaEmpleadoService.findByYearAndSemana(year, semana_numero);
      res.json(items);
    } catch (error) {
      console.error('Error en horasSemanaEmpleadoController.getByYearAndSemana:', error);
      res.status(500).json({ error: 'Error al obtener horas' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await horasSemanaEmpleadoService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en horasSemanaEmpleadoController.create:', error);
      res.status(500).json({ error: 'Error al crear registro de horas' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await horasSemanaEmpleadoService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en horasSemanaEmpleadoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar registro de horas' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await horasSemanaEmpleadoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en horasSemanaEmpleadoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar registro de horas' });
    }
  },
};
