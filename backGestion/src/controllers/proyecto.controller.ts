import { Request, Response } from 'express';
import { proyectoService, asignacionProyectoEmpleadoService } from '../services';
import { parseId } from '../utils/parseId';

function toProyectoPublic(obj: any) {
  const responsableNombre =
    obj.empleado?.nombre || obj.empleado?.apellido
      ? `${obj.empleado?.nombre ?? ''} ${obj.empleado?.apellido ?? ''}`.trim()
      : null;

  return {
    id: obj.id,
    codigo: obj.codigo,
    nombre: obj.nombre,
    cliente: obj.cliente ?? null,
    modelo_proyecto_id: obj.modelo_proyecto_id,
    descripcion: obj.descripcion ?? null,
    tarifa: obj.tarifa != null ? String(obj.tarifa) : null,
    fecha_inicio: obj.fecha_inicio,
    fecha_final_prevista: obj.fecha_final_prevista,
    fecha_final: obj.fecha_final,
    pais_id: obj.pais_id,
    ciudad: obj.ciudad ?? null,
    responsable_id: obj.responsable_id,
    responsable_nombre: responsableNombre,
    // Si se pidieron relaciones, las dejamos pasar (excepto empleado completo).
    ...(obj.pais !== undefined ? { pais: obj.pais } : {}),
    ...(obj.modelo_proyecto !== undefined ? { modelo_proyecto: obj.modelo_proyecto } : {}),
  };
}

export const proyectoController = {
  async getAll(req: Request, res: Response) {
    try {
      const pageRaw = req.query.page;
      const limitRaw = req.query.limit;

      const page = pageRaw !== undefined ? Number(pageRaw) : 1;
      const limit = limitRaw !== undefined ? Number(limitRaw) : 10;

      const includeBase = {
        empleado: { select: { id: true, nombre: true, apellido: true } },
      } as const;
      const include =
        req.query.include === 'relations'
          ? { ...includeBase, pais: true, modelo_proyecto: true }
          : includeBase;

      const result = await proyectoService.findAllPaginated(undefined, include, page, limit);

      res.json({
        items: result.items.map(toProyectoPublic),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error('Error en proyectoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener proyectos' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const includeBase = {
        empleado: { select: { id: true, nombre: true, apellido: true } },
      } as const;
      const include =
        req.query.include === 'relations'
          ? { ...includeBase, pais: true, modelo_proyecto: true }
          : includeBase;

      const item = await proyectoService.findById(id, include);
      if (!item) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
      }

      const asignacionesRaw = await asignacionProyectoEmpleadoService.findByProyecto(id);
      const asignaciones = asignacionesRaw.map((a: any) => {
        const empleadoNombre =
          a.empleado && (a.empleado.nombre || a.empleado.apellido)
            ? `${a.empleado.nombre ?? ''} ${a.empleado.apellido ?? ''}`.trim()
            : null;

        const rolProyectoName =
          (a.rol_proyecto as any)?.nombre ??
          (a.rol_proyecto as any)?.descripcion ??
          null;

        return {
          id: a.id,
          codigo: a.codigo,
          empleado_id: a.empleado_id,
          empleado_name: empleadoNombre,
          empleado_email: a.empleado?.email ?? null,
          rol_proyecto_id: a.rol_proyecto_id,
          rol_proyecto_name: rolProyectoName,
          fecha_inicio: a.fecha_inicio,
          fecha_final: a.fecha_final,
          activo: a.activo,
          porcentaje_asignacion:
            a.porcentaje_asignacion != null ? String(a.porcentaje_asignacion) : null,
        };
      });

      res.json({
        ...toProyectoPublic(item),
        asignaciones,
      });
    } catch (error) {
      console.error('Error en proyectoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener proyecto' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = parseId(req.params.codigo);
      if (codigo === null) {
        return res.status(400).json({ error: 'Código inválido' });
      }
      const includeBase = {
        empleado: { select: { id: true, nombre: true, apellido: true } },
      } as const;
      const item = await proyectoService.findByCodigo(codigo, includeBase);
      if (!item) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
      }
      res.json(toProyectoPublic(item));
    } catch (error) {
      console.error('Error en proyectoController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener proyecto' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await proyectoService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error en proyectoController.create:', error);
      res.status(500).json({ error: 'Error al crear proyecto' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const item = await proyectoService.update(id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Error en proyectoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar proyecto' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      await proyectoService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error en proyectoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar proyecto' });
    }
  },
};
