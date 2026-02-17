import { Request, Response } from 'express';
import { perfilService } from '../services';
import { parseId, getParam } from '../utils/parseId';

export const perfilController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const items = await perfilService.findAll(where);
      res.json(items);
    } catch (error) {
      console.error('Error en perfilController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener perfiles' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await perfilService.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Perfil no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en perfilController.getById:', error);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await perfilService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Perfil no encontrado' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error en perfilController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await perfilService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en perfilController.create:', error);
      res.status(500).json({ error: 'Error al crear perfil' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await perfilService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en perfilController.update:', error);
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await perfilService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en perfilController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar perfil' });
    }
  },
};
