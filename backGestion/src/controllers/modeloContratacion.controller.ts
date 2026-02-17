import { Request, Response } from 'express';
import { modeloContratacionService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const modeloContratacionController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const items = await modeloContratacionService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en modeloContratacionController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener modelos de contratación' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await modeloContratacionService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Modelo de contratación no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en modeloContratacionController.getById:', error);
      res.status(500).json({ error: 'Error al obtener modelo de contratación' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await modeloContratacionService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Modelo de contratación no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en modeloContratacionController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener modelo de contratación' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await modeloContratacionService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en modeloContratacionController.create:', error);
      res.status(500).json({ error: 'Error al crear modelo de contratación' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await modeloContratacionService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en modeloContratacionController.update:', error);
      res.status(500).json({ error: 'Error al actualizar modelo de contratación' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await modeloContratacionService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en modeloContratacionController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar modelo de contratación' });
    }
  },
};
