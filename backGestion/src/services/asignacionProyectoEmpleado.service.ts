import prisma from '../prisma';
import type {
  asignacion_proyecto_empleado,
  Prisma,
} from '../generated/prisma/client';

// Factores y constantes de coste (alineados con empleado.service)
const COSTE_EMPRESA_FACTOR = 1;
const ANNUAL_WORKING_HOURS = 1760; // mismas horas anuales que en empleado.service
const DAILY_WORKING_HOURS = 8; // horas estándar por día para estimar la asignación

type CalculoCostoParams = {
  costeHoraBase: number;
  fechaInicio: Date;
  fechaFinal: Date;
  porcentajeAsignacion: number;
};

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  return d;
}

function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function calcularCostoAsignacionPeriodo(params: CalculoCostoParams) {
  const { costeHoraBase, fechaInicio, fechaFinal, porcentajeAsignacion } = params;

  const start = startOfDay(fechaInicio);
  const end = startOfDay(fechaFinal);
  if (end.getTime() < start.getTime()) {
    return {
      diasPeriodo: 0,
      horasPeriodo: 0,
      horasAsignacion: 0,
      costoAsignacionPeriodo: 0,
    };
  }

  const msPorDia = 1000 * 60 * 60 * 24;
  const diasPeriodo =
    Math.floor((end.getTime() - start.getTime()) / msPorDia) + 1; // incluir ambos días

  const horasPeriodo = diasPeriodo * DAILY_WORKING_HOURS;
  const horasAsignacion = horasPeriodo * (porcentajeAsignacion / 100);
  const costoAsignacionPeriodo = horasAsignacion * costeHoraBase;

  return {
    diasPeriodo,
    horasPeriodo,
    horasAsignacion,
    costoAsignacionPeriodo,
  };
}

export async function obtenerCosteHoraBase(empleadoId: number): Promise<number | null> {
  const empleado = await prisma.empleado.findUnique({ where: { id: empleadoId } });
  if (!empleado) return null;

  if (empleado.coste_hora != null) {
    const value =
      typeof empleado.coste_hora === 'number'
        ? empleado.coste_hora
        : Number(empleado.coste_hora as unknown);
    return Number.isNaN(value) ? null : value;
  }

  if (empleado.sba != null) {
    const sbaNumber =
      typeof empleado.sba === 'number' ? empleado.sba : Number(empleado.sba as unknown);
    if (!Number.isNaN(sbaNumber)) {
      const costeEmpresa = sbaNumber * COSTE_EMPRESA_FACTOR;
      return costeEmpresa / ANNUAL_WORKING_HOURS;
    }
  }

  return null;
}

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
      include: {
        proyecto: {
          include: {
            empleado: true, // responsable
          },
        },
        rol_proyecto: true,
      },
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
    return prisma.$transaction(async (tx) => {
      const rawData = data as any;

      const empleadoId: number | null =
        typeof rawData.empleado_id === 'number'
          ? rawData.empleado_id
          : typeof rawData.empleado_id === 'string'
            ? Number(rawData.empleado_id)
            : null;

      // Normalizamos fechas que puedan venir como string
      const fechaInicioRaw = rawData.fecha_inicio;
      const fechaFinalRaw = rawData.fecha_final;

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

      const porcentajeAsignacionRaw = rawData.porcentaje_asignacion;
      const porcentajeAsignacion =
        typeof porcentajeAsignacionRaw === 'number'
          ? porcentajeAsignacionRaw
          : typeof porcentajeAsignacionRaw === 'string'
            ? Number(porcentajeAsignacionRaw)
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

      if (costoAsignacionPeriodo > 0) {
        rawData.costo_asignacion = costoAsignacionPeriodo;
      }

      const asignacion = await tx.asignacion_proyecto_empleado.create({
        data: {
          ...rawData,
          // Aseguramos que Prisma reciba Date, no el string "YYYY-MM-DD"
          ...(fechaInicio ? { fecha_inicio: fechaInicio } : {}),
          ...(fechaFinal !== null ? { fecha_final: fechaFinal } : {}),
        },
      });

      if (empleadoId != null && fechaInicio && porcentajeAsignacion != null) {
        await tx.asignacion_proyecto_empleado_log.create({
          data: {
            asignacion_id: asignacion.id,
            fecha_inicio: startOfDay(fechaInicio),
            fecha_final: fechaFinal ? startOfDay(fechaFinal) : null,
            porcentaje_asignacion: porcentajeAsignacion,
            costo_asignacion_periodo: costoAsignacionPeriodo,
            costo_hora_utilizado: costeHoraBase ?? 0,
          },
        });
      }

      return asignacion;
    });
  },

  async update(
    id: number,
    data: Prisma.asignacion_proyecto_empleadoUpdateInput
  ): Promise<asignacion_proyecto_empleado> {
    return prisma.$transaction(async (tx) => {
      const current = await tx.asignacion_proyecto_empleado.findUnique({ where: { id } });
      if (!current) {
        throw new Error(`Asignación con id ${id} no encontrada`);
      }

      const rawData = data as any;

      // Normalizamos posibles cambios de fechas y porcentaje
      const fechaInicioNewRaw = rawData.fecha_inicio;
      const fechaFinalNewRaw = rawData.fecha_final;
      const porcentajeNewRaw = rawData.porcentaje_asignacion;

      const fechaInicioNew =
        fechaInicioNewRaw instanceof Date
          ? fechaInicioNewRaw
          : typeof fechaInicioNewRaw === 'string'
            ? new Date(fechaInicioNewRaw)
            : null;

      const fechaFinalNew =
        fechaFinalNewRaw instanceof Date
          ? fechaFinalNewRaw
          : typeof fechaFinalNewRaw === 'string'
            ? new Date(fechaFinalNewRaw)
            : null;

      const porcentajeNew =
        typeof porcentajeNewRaw === 'number'
          ? porcentajeNewRaw
          : typeof porcentajeNewRaw === 'string'
            ? Number(porcentajeNewRaw)
            : null;

      const porcentajeActual =
        current.porcentaje_asignacion != null
          ? Number(current.porcentaje_asignacion as unknown)
          : null;

      const fechaFinalActual = current.fecha_final ?? null;

      const updated = await tx.asignacion_proyecto_empleado.update({
        where: { id },
        data,
      });

      // Si no tenemos empleado o porcentaje, no intentamos calcular coste
      const empleadoId = current.empleado_id;
      const costeHoraBase = await obtenerCosteHoraBase(empleadoId);
      if (costeHoraBase == null) {
        return updated;
      }

      const today = startOfDay(new Date());

      // Obtenemos el último log para esta asignación (si existe)
      const lastLog = await tx.asignacion_proyecto_empleado_log.findFirst({
        where: { asignacion_id: id },
        orderBy: { id: 'desc' },
      });

      const porcentajeFinalNuevo =
        porcentajeNew != null ? porcentajeNew : porcentajeActual != null ? porcentajeActual : null;

      // Caso 1: cambia el porcentaje de asignación -> cerramos tramo anterior (hasta ayer) y abrimos nuevo desde hoy
      if (
        porcentajeActual != null &&
        porcentajeFinalNuevo != null &&
        porcentajeFinalNuevo !== porcentajeActual
      ) {
        const ayer = addDays(today, -1);

        // Cerramos tramo anterior (si hay log abierto)
        if (lastLog && lastLog.fecha_final == null) {
          const inicioTramo = lastLog.fecha_inicio;
          const finTramo = ayer.getTime() < inicioTramo.getTime() ? inicioTramo : ayer;
          const { costoAsignacionPeriodo } = calcularCostoAsignacionPeriodo({
            costeHoraBase,
            fechaInicio: inicioTramo,
            fechaFinal: finTramo,
            porcentajeAsignacion: porcentajeActual,
          });

          await tx.asignacion_proyecto_empleado_log.update({
            where: { id: lastLog.id },
            data: {
              fecha_final: finTramo,
              porcentaje_asignacion: porcentajeActual,
              costo_asignacion_periodo: costoAsignacionPeriodo,
              costo_hora_utilizado: costeHoraBase,
            },
          });
        } else if (!lastLog) {
          // Si no había log previo, creamos uno para el tramo inicial hasta ayer
          const inicioTramo = current.fecha_inicio;
          const finTramo = ayer.getTime() < inicioTramo.getTime() ? inicioTramo : ayer;
          const { costoAsignacionPeriodo } = calcularCostoAsignacionPeriodo({
            costeHoraBase,
            fechaInicio: inicioTramo,
            fechaFinal: finTramo,
            porcentajeAsignacion: porcentajeActual,
          });

          await tx.asignacion_proyecto_empleado_log.create({
            data: {
              asignacion_id: id,
              fecha_inicio: startOfDay(inicioTramo),
              fecha_final: finTramo,
              porcentaje_asignacion: porcentajeActual,
              costo_asignacion_periodo: costoAsignacionPeriodo,
              costo_hora_utilizado: costeHoraBase,
            },
          });
        }

        // Creamos nuevo tramo desde hoy hasta la fecha_final (actualizada si viene)
        const fechaFinalTramo =
          fechaFinalNew ?? fechaFinalActual ?? null;

        let costoNuevoTramo = 0;
        if (fechaFinalTramo) {
          const { costoAsignacionPeriodo } = calcularCostoAsignacionPeriodo({
            costeHoraBase,
            fechaInicio: today,
            fechaFinal: fechaFinalTramo,
            porcentajeAsignacion: porcentajeFinalNuevo,
          });
          costoNuevoTramo = costoAsignacionPeriodo;
        }

        await tx.asignacion_proyecto_empleado_log.create({
          data: {
            asignacion_id: id,
            fecha_inicio: today,
            fecha_final: fechaFinalTramo ? startOfDay(fechaFinalTramo) : null,
            porcentaje_asignacion: porcentajeFinalNuevo,
            costo_asignacion_periodo: costoNuevoTramo,
            costo_hora_utilizado: costeHoraBase,
          },
        });
      }
      // Caso 2: sólo cambia la fecha_final (y tenemos algún log abierto)
      else if (fechaFinalNew && fechaFinalNew !== fechaFinalActual && lastLog) {
        const inicioTramo = lastLog.fecha_inicio;
        const porcentajeParaTramo =
          Number(lastLog.porcentaje_asignacion as unknown) ||
          (porcentajeActual != null ? porcentajeActual : 0);

        const { costoAsignacionPeriodo } = calcularCostoAsignacionPeriodo({
          costeHoraBase,
          fechaInicio: inicioTramo,
          fechaFinal: fechaFinalNew,
          porcentajeAsignacion: porcentajeParaTramo,
        });

        await tx.asignacion_proyecto_empleado_log.update({
          where: { id: lastLog.id },
          data: {
            fecha_final: startOfDay(fechaFinalNew),
            porcentaje_asignacion: porcentajeParaTramo,
            costo_asignacion_periodo: costoAsignacionPeriodo,
            costo_hora_utilizado: costeHoraBase,
          },
        });
      }

      // Recalculamos el coste total de la asignación como suma de todos los tramos
      const logs = await tx.asignacion_proyecto_empleado_log.findMany({
        where: { asignacion_id: id },
      });

      const totalCosto = logs.reduce((acc: number, log: any) => {
        const value =
          typeof log.costo_asignacion_periodo === 'number'
            ? log.costo_asignacion_periodo
            : Number(log.costo_asignacion_periodo as unknown);
        if (Number.isNaN(value)) return acc;
        return acc + value;
      }, 0);

      const asignacionConCosto = await tx.asignacion_proyecto_empleado.update({
        where: { id },
        data: {
          costo_asignacion: totalCosto,
        },
      });

      return asignacionConCosto;
    });
  },

  async delete(id: number): Promise<asignacion_proyecto_empleado> {
    return prisma.asignacion_proyecto_empleado.delete({ where: { id } });
  },
};
