import { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client';
import { empleadoService, authService, asignacionProyectoEmpleadoService } from '../services';
import { parseId, getParam } from '../utils/parseId';

function toEmpleadoPublic(obj: any) {
  return {
    id: obj.id,
    codigo_empleado: obj.codigo_empleado,
    nombre: obj.nombre,
    apellido: obj.apellido,
    email: obj.email ?? null,
    telefono: obj.telefono ?? null,
    perfil_id: obj.perfil_id,
    perfil_nombre: obj.perfil?.descripcion ?? null,
    dimension_id: obj.dimension_id,
    dimension_nombre: obj.dimension?.descripcion ?? null,
    modelo_contratacion_id: obj.modelo_contratacion_id,
    modelo_contratacion_nombre: obj.modelo_contratacion?.descripcion ?? null,
    pais_id: obj.pais_id,
    pais_nombre: obj.pais?.descripcion ?? null,
    fecha_alta: obj.fecha_alta,
    fecha_baja: obj.fecha_baja,
    razon_baja: obj.razon_baja,
    activo: obj.activo,
    sba: obj.sba != null ? Number(obj.sba) : null,
    cv_url: obj.cv_url ?? null,
  };
}

export const empleadoController = {
  async getAll(req: Request, res: Response) {
    try {
      const where = req.query.activo !== undefined
        ? { activo: req.query.activo === 'true' }
        : undefined;
      const include = { dimension: true, perfil: true, pais: true, modelo_contratacion: true };

      const page = req.query.page !== undefined ? Number(req.query.page) : 1;
      const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;

      const result = await empleadoService.findPaginated(where, include, page, limit);
      res.json({
        items: result.items.map((item: any) => {
          const base = toEmpleadoPublic(item);
          const asignaciones =
            Array.isArray(item.asignacion_proyecto_empleado) &&
            item.asignacion_proyecto_empleado.length > 0
              ? item.asignacion_proyecto_empleado.map((a: any) => {
                  const responsable = a.proyecto?.empleado;
                  const responsableNombre =
                    responsable && (responsable.nombre || responsable.apellido)
                      ? `${responsable.nombre ?? ''} ${responsable.apellido ?? ''}`.trim()
                      : '';

                  return {
                    id: a.id,
                    codigo: a.codigo,
                    proyecto_id: a.proyecto_id,
                    proyecto_name: a.proyecto?.nombre ?? null,
                    rol_proyecto_id: a.rol_proyecto_id,
                    rol_proyecto_name:
                      (a.rol_proyecto as any)?.nombre ??
                      (a.rol_proyecto as any)?.descripcion ??
                      null,
                    fecha_inicio: a.fecha_inicio,
                    fecha_final: a.fecha_final,
                    activo: a.activo,
                    porcentaje_asignacion: a.porcentaje_asignacion,
                    responsable_id: a.proyecto?.responsable_id ?? null,
                    responsable_name: responsableNombre,
                  };
                })
              : [];

          return {
            ...base,
            asignaciones,
          };
        }),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error('Error en empleadoController.getAll:', error);
      res.status(500).json({ error: 'Error al obtener empleados' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const include = { dimension: true, perfil: true, pais: true, modelo_contratacion: true };
      const item = await empleadoService.findById(id, include);
      if (!item) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      const asignacionesRaw = await asignacionProyectoEmpleadoService.findByEmpleado(id);
      const asignaciones = asignacionesRaw.map((a: any) => {
        const responsable = a.proyecto?.empleado;
        const responsableNombre =
          responsable && (responsable.nombre || responsable.apellido)
            ? `${responsable.nombre ?? ''} ${responsable.apellido ?? ''}`.trim()
            : '';

        return {
          id: a.id,
          codigo: a.codigo,
          proyecto_id: a.proyecto_id,
          proyecto_name: a.proyecto?.nombre ?? null,
          rol_proyecto_id: a.rol_proyecto_id,
          rol_proyecto_name:
            (a.rol_proyecto as any)?.nombre ??
            (a.rol_proyecto as any)?.descripcion ??
            null,
          fecha_inicio: a.fecha_inicio,
          fecha_final: a.fecha_final,
          activo: a.activo,
          porcentaje_asignacion: a.porcentaje_asignacion,
          responsable_id: a.proyecto?.responsable_id ?? null,
          responsable_name: responsableNombre,
        };
      });
      res.json({
        ...toEmpleadoPublic(item),
        asignaciones,
      });
    } catch (error) {
      console.error('Error en empleadoController.getById:', error);
      res.status(500).json({ error: 'Error al obtener empleado' });
    }
  },

  async getByCodigo(req: Request, res: Response) {
    try {
      const codigo = getParam(req.params.codigo);
      if (!codigo) {
        return res.status(400).json({ error: 'Código requerido' });
      }
      const item = await empleadoService.findByCodigo(codigo);
      if (!item) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.json(toEmpleadoPublic(item));
    } catch (error) {
      console.error('Error en empleadoController.getByCodigo:', error);
      res.status(500).json({ error: 'Error al obtener empleado' });
    }
  },

  async getByEmail(req: Request, res: Response) {
    try {
      const email = getParam(req.params.email);
      if (!email) {
        return res.status(400).json({ error: 'Email requerido' });
      }
      const item = await empleadoService.findByEmail(email);
      if (!item) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.json(toEmpleadoPublic(item));
    } catch (error) {
      console.error('Error en empleadoController.getByEmail:', error);
      res.status(500).json({ error: 'Error al obtener empleado' });
    }
  },

  async getByUsername(req: Request, res: Response) {
    try {
      const username = getParam(req.params.username);
      if (!username) {
        return res.status(400).json({ error: 'Username requerido' });
      }
      const item = await empleadoService.findByUsername(username);
      if (!item) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.json(toEmpleadoPublic(item));
    } catch (error) {
      console.error('Error en empleadoController.getByUsername:', error);
      res.status(500).json({ error: 'Error al obtener empleado' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const allowedKeys = [
        'codigo_empleado',
        'nombre',
        'apellido',
        'perfil_id',
        'dimension_id',
        'modelo_contratacion_id',
        'pais_id',
        'fecha_alta',
        'activo',
        'sba',
        'email',
        'telefono',
        'cv_url',
      ] as const;
      const body: Record<string, unknown> = {};
      for (const key of allowedKeys) {
        if (req.body[key] !== undefined) {
          body[key] = req.body[key];
        }
      }
      const item = await empleadoService.create(body as Parameters<typeof empleadoService.create>[0]);
      res.status(201).json(toEmpleadoPublic(item));
    } catch (error) {
      console.error('Error en empleadoController.create:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const meta = error.meta as { target?: string[] } | undefined;
          const field = meta?.target?.[0] ?? 'registro';
          return res.status(409).json({
            error: `Ya existe un empleado con ese valor (${field}).`,
            field,
          });
        }
      }
      const message = error instanceof Error ? error.message : 'Error al crear empleado';
      res.status(500).json({ error: 'Error al crear empleado', detail: message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const body = { ...req.body };
      if (body.password) {
        body.password_hash = await authService.hashPassword(body.password);
        delete body.password;
      }
      const item = await empleadoService.update(id, body);
      res.json(toEmpleadoPublic(item));
    } catch (error) {
      console.error('Error en empleadoController.update:', error);
      res.status(500).json({ error: 'Error al actualizar empleado' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const fechaBajaRaw =
        req.body?.fecha_baja != null ? new Date(req.body.fecha_baja) : new Date();
      const fechaBaja = Number.isNaN(fechaBajaRaw.getTime()) ? new Date() : fechaBajaRaw;
      const razonBaja =
        typeof req.body?.razon_baja === 'string' ? req.body.razon_baja : null;
      await empleadoService.update(id, {
        activo: false,
        fecha_baja: fechaBaja,
        razon_baja: razonBaja,
      });
      res.status(204).send();
    } catch (error) {
      console.error('Error en empleadoController.delete:', error);
      res.status(500).json({ error: 'Error al eliminar empleado' });
    }
  },
};
