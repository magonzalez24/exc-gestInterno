import prisma from '../prisma';
import type { proyecto, Prisma } from '../generated/prisma/client';
import {
  calcularCostoAsignacionPeriodo,
  obtenerCosteHoraBase,
  startOfDay,
} from './asignacionProyectoEmpleado.service';

export const proyectoService = {
  async findAll(where?: Prisma.proyectoWhereInput, include?: Prisma.proyectoInclude): Promise<proyecto[]> {
    return prisma.proyecto.findMany({
      where,
      include,
      orderBy: { fecha_inicio: 'desc' },
    });
  },

  async findAllPaginated(
    where: Prisma.proyectoWhereInput | undefined,
    include: Prisma.proyectoInclude | undefined,
    page: number,
    limit: number
  ): Promise<{
    items: proyecto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;

    const [items, total] = await prisma.$transaction([
      prisma.proyecto.findMany({
        where,
        include,
        orderBy: { fecha_inicio: 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.proyecto.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  },

  async findById(id: number, include?: Prisma.proyectoInclude): Promise<proyecto | null> {
    return prisma.proyecto.findUnique({ where: { id }, include });
  },

  async findByCodigo(codigo: number, include?: Prisma.proyectoInclude): Promise<proyecto | null> {
    return prisma.proyecto.findUnique({ where: { codigo }, include });
  },

  async create(
    data: Prisma.proyectoUncheckedCreateInput & {
      asignaciones?: Array<
        Omit<Prisma.asignacion_proyecto_empleadoUncheckedCreateInput, 'id' | 'proyecto_id'>
      >
    }
  ): Promise<proyecto> {
    const { asignaciones, ...proyectoData } = data as any;

    return prisma.$transaction(async (tx) => {
      // Adaptamos el payload con ids a la forma esperada por Prisma
      const {
        modelo_proyecto_id,
        pais_id,
        responsable_id,
        id: _ignoredId,
        fecha_inicio,
        fecha_final_prevista,
        fecha_final,
        ...restProyecto
      } = proyectoData as Prisma.proyectoUncheckedCreateInput;

      const createdProyecto = await tx.proyecto.create({
        data: {
          ...restProyecto,
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
          fecha_final_prevista: fecha_final_prevista ? new Date(fecha_final_prevista) : null,
          fecha_final: fecha_final ? new Date(fecha_final) : null,
          // conectamos las relaciones requeridas usando los *_id recibidos
          modelo_proyecto: { connect: { id: modelo_proyecto_id } },
          pais: { connect: { id: pais_id } },
          empleado: { connect: { id: responsable_id } },
        } as Prisma.proyectoCreateInput,
      });

      if (Array.isArray(asignaciones) && asignaciones.length > 0) {
        await Promise.all(
          asignaciones.map(async (asig) => {
            const rawAsig: any = asig;

            const empleadoId: number | null =
              typeof rawAsig.empleado_id === 'number'
                ? rawAsig.empleado_id
                : typeof rawAsig.empleado_id === 'string'
                  ? Number(rawAsig.empleado_id)
                  : null;

            const fechaInicioRaw = rawAsig.fecha_inicio;
            const fechaFinalRaw = rawAsig.fecha_final;

            const fechaInicio =
              fechaInicioRaw instanceof Date
                ? fechaInicioRaw
                : typeof fechaInicioRaw === 'string'
                  ? new Date(fechaInicioRaw)
                  : null;

            const fechaFinal =
              fechaFinalRaw instanceof Date
                ? fechaFinalRaw
                : typeof fechaFinalRaw === 'string'
                  ? new Date(fechaFinalRaw)
                  : null;

            const porcentajeRaw = rawAsig.porcentaje_asignacion;
            const porcentajeAsignacion =
              typeof porcentajeRaw === 'number'
                ? porcentajeRaw
                : typeof porcentajeRaw === 'string'
                  ? Number(porcentajeRaw)
                  : null;

            let costoAsignacionPeriodo = 0;
            let costeHoraBase: number | null = null;

            if (empleadoId != null && fechaInicio && porcentajeAsignacion != null) {
              costeHoraBase = await obtenerCosteHoraBase(empleadoId);

              if (costeHoraBase != null && fechaFinal) {
                const { costoAsignacionPeriodo: costo } = calcularCostoAsignacionPeriodo({
                  costeHoraBase,
                  fechaInicio,
                  fechaFinal,
                  porcentajeAsignacion,
                });
                costoAsignacionPeriodo = costo;
              }
            }

            const createdAsignacion = await tx.asignacion_proyecto_empleado.create({
              data: {
                ...rawAsig,
                proyecto_id: createdProyecto.id,
                ...(costoAsignacionPeriodo > 0
                  ? { costo_asignacion: costoAsignacionPeriodo }
                  : {}),
              } as any,
            });

            if (empleadoId != null && fechaInicio && porcentajeAsignacion != null) {
              await tx.asignacion_proyecto_empleado_log.create({
                data: {
                  asignacion_id: createdAsignacion.id,
                  fecha_inicio: startOfDay(fechaInicio),
                  fecha_final: fechaFinal ? startOfDay(fechaFinal) : null,
                  porcentaje_asignacion: porcentajeAsignacion,
                  costo_asignacion_periodo: costoAsignacionPeriodo,
                  costo_hora_utilizado: costeHoraBase ?? 0,
                },
              });
            }
          })
        );
      }

      return createdProyecto;
    });
  },

  async update(id: number, data: Prisma.proyectoUpdateInput): Promise<proyecto> {
    return prisma.proyecto.update({ where: { id }, data });
  },

  async delete(id: number): Promise<proyecto> {
    return prisma.proyecto.delete({ where: { id } });
  },
};
