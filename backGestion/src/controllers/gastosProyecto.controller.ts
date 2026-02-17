import { Request, Response } from 'express';
import { gastosProyectoService } from '../services';
import { parseId } from '../utils/parseId';

export const gastosProyectoController = {
  async getAll(req: Request, res: Response) {
    try {
      const proyecto_id = req.query.proyecto_id
        ? parseId(String(req.query.proyecto_id))
        : undefined;
      const where = proyecto_id !== undefined && proyecto_id !== null
        ? { proyecto_id }
        : undefined;
      const items = await gastosProyectoService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en gastosProyectoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener gastos' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await gastosProyectoService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en gastosProyectoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener gasto' });
    }
  },

  async getByProyecto(req: Request, res: Response) {
    try {
      const proyecto_id = parseId(req.params.proyectoId);
      if (proyecto_id === null) {
        return res.status(400).json({ error: 'ID de proyecto inválido' });
      }
      const items = await gastosProyectoService.findByProyecto(proyecto_id);
      res.json(items);
    } catch (error) {
      console.error('Error en gastosProyectoController.getByProyecto:', error);
      res.status(500).json({ error: 'Error al obtener gastos del proyecto' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await gastosProyectoService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en gastosProyectoController.create:', error);
      res.status(500).json({ error: 'Error al crear gasto' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await gastosProyectoService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en gastosProyectoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar gasto' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await gastosProyectoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en gastosProyectoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar gasto' });
    }
  },
};
