import prisma from '../prisma';
import type { horas_semana_empleado, Prisma } from '../generated/prisma/client';

export const horasSemanaEmpleadoService = {
  async findAll(where?: Prisma.horas_semana_empleadoWhereInput): Promise<horas_semana_empleado[]> {
    return prisma.horas_semana_empleado.findMany({
      where,
      orderBy: [{ year: 'desc' }, { semana_numero: 'desc' }],
    });
  },

  async findById(id: number): Promise<horas_semana_empleado | null> {
    return prisma.horas_semana_empleado.findUnique({ where: { id } });
  },

  async findByAsignacion(asignacion_proyecto_id: number): Promise<horas_semana_empleado[]> {
    return prisma.horas_semana_empleado.findMany({
      where: { asignacion_proyecto_id },
      orderBy: [{ year: 'desc' }, { semana_numero: 'desc' }],
    });
  },

  async findByYearAndSemana(year: number, semana_numero: number): Promise<horas_semana_empleado[]> {
    return prisma.horas_semana_empleado.findMany({
      where: { year, semana_numero },
    });
  },

  async create(data: Prisma.horas_semana_empleadoCreateInput): Promise<horas_semana_empleado> {
    return prisma.horas_semana_empleado.create({ data });
  },

  async update(id: number, data: Prisma.horas_semana_empleadoUpdateInput): Promise<horas_semana_empleado> {
    return prisma.horas_semana_empleado.update({ where: { id }, data });
  },

  async delete(id: number): Promise<horas_semana_empleado> {
    return prisma.horas_semana_empleado.delete({ where: { id } });
  },
};
