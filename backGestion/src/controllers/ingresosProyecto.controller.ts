import { Request, Response } from 'express';
import { ingresosProyectoService } from '../services';
import { parseId } from '../utils/parseId';

export const ingresosProyectoController = {
  async getAll(req: Request, res: Response) {
    try {
      const proyecto_id = req.query.proyecto_id
        ? parseId(String(req.query.proyecto_id))
        : undefined;
      const where = proyecto_id !== undefined && proyecto_id !== null
        ? { proyecto_id }
        : undefined;
      const items = await ingresosProyectoService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en ingresosProyectoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener ingresos' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await ingresosProyectoService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Ingreso no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en ingresosProyectoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener ingreso' });
    }
  },

  async getByProyecto(req: Request, res: Response) {
    try {
      const proyecto_id = parseId(req.params.proyectoId);
      if (proyecto_id === null) {
        return res.status(400).json({ error: 'ID de proyecto inválido' });
      }
      const items = await ingresosProyectoService.findByProyecto(proyecto_id);
      res.json(items);
    } catch (error) {
      console.error('Error en ingresosProyectoController.getByProyecto:', error);
      res.status(500).json({ error: 'Error al obtener ingresos del proyecto' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await ingresosProyectoService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en ingresosProyectoController.create:', error);
      res.status(500).json({ error: 'Error al crear ingreso' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await ingresosProyectoService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en ingresosProyectoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar ingreso' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await ingresosProyectoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en ingresosProyectoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar ingreso' });
    }
  },
};
