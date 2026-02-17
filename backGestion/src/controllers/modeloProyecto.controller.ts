import { Request, Response } from 'express';
import { modeloProyectoService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const modeloProyectoController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const items = await modeloProyectoService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en modeloProyectoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener modelos de proyecto' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await modeloProyectoService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Modelo de proyecto no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en modeloProyectoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener modelo de proyecto' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await modeloProyectoService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Modelo de proyecto no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en modeloProyectoController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener modelo de proyecto' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await modeloProyectoService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en modeloProyectoController.create:', error);
      res.status(500).json({ error: 'Error al crear modelo de proyecto' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await modeloProyectoService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en modeloProyectoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar modelo de proyecto' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await modeloProyectoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en modeloProyectoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar modelo de proyecto' });
    }
  },
};
