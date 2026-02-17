import { Request, Response } from 'express';
import { rolService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const rolController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const items = await rolService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en rolController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener roles' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await rolService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en rolController.getById:', error);
      res.status(500).json({ error: 'Error al obtener rol' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await rolService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en rolController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener rol' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await rolService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en rolController.create:', error);
      res.status(500).json({ error: 'Error al crear rol' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await rolService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en rolController.update:', error);
      res.status(500).json({ error: 'Error al actualizar rol' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await rolService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en rolController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar rol' });
    }
  },
};
