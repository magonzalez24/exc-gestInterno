import prisma from '../prisma';
import type { ingresos_proyecto, Prisma } from '../generated/prisma/client';

export const ingresosProyectoService = {
  async findAll(where?: Prisma.ingresos_proyectoWhereInput): Promise<ingresos_proyecto[]> {
    return prisma.ingresos_proyecto.findMany({
      where,
      orderBy: { fecha_ingreso: 'desc' },
    });
  },

  async findById(id: number): Promise<ingresos_proyecto | null> {
    return prisma.ingresos_proyecto.findUnique({ where: { id } });
  },

  async findByProyecto(proyecto_id: number): Promise<ingresos_proyecto[]> {
    return prisma.ingresos_proyecto.findMany({
      where: { proyecto_id },
      orderBy: { fecha_ingreso: 'desc' },
    });
  },

  async create(data: Prisma.ingresos_proyectoCreateInput): Promise<ingresos_proyecto> {
    return prisma.ingresos_proyecto.create({ data });
  },

  async update(id: number, data: Prisma.ingresos_proyectoUpdateInput): Promise<ingresos_proyecto> {
    return prisma.ingresos_proyecto.update({ where: { id }, data });
  },

  async delete(id: number): Promise<ingresos_proyecto> {
    return prisma.ingresos_proyecto.delete({ where: { id } });
  },
};
