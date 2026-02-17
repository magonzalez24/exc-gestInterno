import { Request, Response } from 'express';
import { paisService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const paisController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const items = await paisService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en paisController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener países' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await paisService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'País no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en paisController.getById:', error);
      res.status(500).json({ error: 'Error al obtener país' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await paisService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'País no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en paisController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener país' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await paisService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en paisController.create:', error);
      res.status(500).json({ error: 'Error al crear país' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await paisService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en paisController.update:', error);
      res.status(500).json({ error: 'Error al actualizar país' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await paisService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en paisController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar país' });
    }
  },
};
