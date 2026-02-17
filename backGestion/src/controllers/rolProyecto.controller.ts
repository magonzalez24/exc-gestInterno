import { Request, Response } from 'express';
import { rolProyectoService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const rolProyectoController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const items = await rolProyectoService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en rolProyectoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener roles de proyecto' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await rolProyectoService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Rol de proyecto no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en rolProyectoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener rol de proyecto' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await rolProyectoService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Rol de proyecto no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en rolProyectoController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener rol de proyecto' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await rolProyectoService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en rolProyectoController.create:', error);
      res.status(500).json({ error: 'Error al crear rol de proyecto' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await rolProyectoService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en rolProyectoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar rol de proyecto' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await rolProyectoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en rolProyectoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar rol de proyecto' });
    }
  },
};
