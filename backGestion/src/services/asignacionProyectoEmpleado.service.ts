import prisma from '../prisma';
import type { asignacion_proyecto_empleado, Prisma } from '../generated/prisma/client';

export const asignacionProyectoEmpleadoService = {
  async findAll(
    where?: Prisma.asignacion_proyecto_empleadoWhereInput,
    include?: Prisma.asignacion_proyecto_empleadoInclude
  ): Promise<asignacion_proyecto_empleado[]> {
    return prisma.asignacion_proyecto_empleado.findMany({
      where,
      include,
      orderBy: { fecha_inicio: 'desc' },
    });
  },

  async findById(
    id: number,
    include?: Prisma.asignacion_proyecto_empleadoInclude
  ): Promise<asignacion_proyecto_empleado | null> {
    return prisma.asignacion_proyecto_empleado.findUnique({ where: { id }, include });
  },

  async findByCodigo(codigo: string): Promise<asignacion_proyecto_empleado | null> {
    return prisma.asignacion_proyecto_empleado.findUnique({ where: { codigo } });
  },

  async findByProyecto(proyecto_id: number): Promise<asignacion_proyecto_empleado[]> {
    return prisma.asignacion_proyecto_empleado.findMany({
      where: { proyecto_id },
      include: { empleado: true, rol_proyecto: true },
      orderBy: { fecha_inicio: 'desc' },
    });
  },

  async findByEmpleado(empleado_id: number): Promise<asignacion_proyecto_empleado[]> {
    return prisma.asignacion_proyecto_empleado.findMany({
      where: { empleado_id },
      include: { proyecto: true, rol_proyecto: true },
      orderBy: { fecha_inicio: 'desc' },
    });
  },

  /**
   * Devuelve las asignaciones cuya fecha_final está dentro de los próximos `monthsAhead` meses
   * contando desde hoy (inclusive el día de hoy, exclusivo el límite superior).
   *
   * Por defecto busca dentro de los próximos 2 meses.
   */
  async findWithFechaFinInNextMonths(
    monthsAhead = 2
  ): Promise<any[]> {
    const now = new Date();
    const to = new Date(now);
    to.setMonth(to.getMonth() + monthsAhead);

    const items = await prisma.asignacion_proyecto_empleado.findMany({
      where: {
        fecha_final: {
          gte: now,
          lt: to,
        },
      },
      include: {
        empleado: {
          include: {
            perfil: true,
          },
        },
        proyecto: {
          include: {
            modelo_proyecto: true,
            empleado: true, // responsable
          },
        },
        rol_proyecto: true,
      },
      orderBy: { fecha_final: 'asc' },
    });

    // Proyectamos al formato requerido por el front
    return items.map((a) => {
      const responsable = a.proyecto?.empleado;
      const responsableNombre =
        responsable && (responsable.nombre || responsable.apellido)
          ? `${responsable.nombre ?? ''} ${responsable.apellido ?? ''}`.trim()
          : null;

      return {
        id: a.id,
        proyecto_id: a.proyecto_id,
        empleado_id: a.empleado_id,

        nombre: a.empleado?.nombre ?? null,
        apellido: a.empleado?.apellido ?? null,
        perfil_id: a.empleado?.perfil_id ?? null,
        perfil_name: a.empleado?.perfil?.descripcion ?? null,

        rol_proyecto_id: a.rol_proyecto_id,
        rol_proyecto_name:
          (a.rol_proyecto as any)?.nombre ??
          (a.rol_proyecto as any)?.descripcion ??
          null,

        fecha_final: a.fecha_final,
        activo: a.activo,
        porcentaje_asignacion: a.porcentaje_asignacion,

        nombre_proyecto: a.proyecto?.nombre ?? null,
        cliente: a.proyecto?.cliente ?? null,
        modelo_proyecto_id: a.proyecto?.modelo_proyecto_id ?? null,
        modelo_proyecto_name: a.proyecto?.modelo_proyecto
          ? (a.proyecto.modelo_proyecto as any).descripcion ??
            (a.proyecto.modelo_proyecto as any).nombre ??
            null
          : null,
        responsable_id: a.proyecto?.responsable_id ?? null,
        responsable_name: responsableNombre,

        // Alias adicional para el nombre del rol
        rol_proyecto:
          (a.rol_proyecto as any)?.nombre ??
          (a.rol_proyecto as any)?.descripcion ??
          null,
      };
    });
  },

  async create(data: Prisma.asignacion_proyecto_empleadoCreateInput): Promise<asignacion_proyecto_empleado> {
    return prisma.asignacion_proyecto_empleado.create({ data });
  },

  async update(
    id: number,
    data: Prisma.asignacion_proyecto_empleadoUpdateInput
  ): Promise<asignacion_proyecto_empleado> {
    return prisma.asignacion_proyecto_empleado.update({ where: { id }, data });
  },

  async delete(id: number): Promise<asignacion_proyecto_empleado> {
    return prisma.asignacion_proyecto_empleado.delete({ where: { id } });
  },
};
