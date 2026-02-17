import { Request, Response } from 'express';
import { dimensionService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const dimensionController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const items = await dimensionService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en dimensionController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener dimensiones' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await dimensionService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Dimensión no encontrada' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en dimensionController.getById:', error);
      res.status(500).json({ error: 'Error al obtener dimensión' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await dimensionService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Dimensión no encontrada' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en dimensionController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener dimensión' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await dimensionService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en dimensionController.create:', error);
      res.status(500).json({ error: 'Error al crear dimensión' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await dimensionService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en dimensionController.update:', error);
      res.status(500).json({ error: 'Error al actualizar dimensión' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await dimensionService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en dimensionController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar dimensión' });
    }
  },
};
