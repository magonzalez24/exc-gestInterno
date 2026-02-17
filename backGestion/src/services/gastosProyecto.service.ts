import prisma from '../prisma';
import type { gastos_proyecto, Prisma } from '../generated/prisma/client';

export const gastosProyectoService = {
  async findAll(where?: Prisma.gastos_proyectoWhereInput): Promise<gastos_proyecto[]> {
    return prisma.gastos_proyecto.findMany({
      where,
      orderBy: { fecha_gasto: 'desc' },
    });
  },

  async findById(id: number): Promise<gastos_proyecto | null> {
    return prisma.gastos_proyecto.findUnique({ where: { id } });
  },

  async findByProyecto(proyecto_id: number): Promise<gastos_proyecto[]> {
    return prisma.gastos_proyecto.findMany({
      where: { proyecto_id },
      orderBy: { fecha_gasto: 'desc' },
    });
  },

  async create(data: Prisma.gastos_proyectoCreateInput): Promise<gastos_proyecto> {
    return prisma.gastos_proyecto.create({ data });
  },

  async update(id: number, data: Prisma.gastos_proyectoUpdateInput): Promise<gastos_proyecto> {
    return prisma.gastos_proyecto.update({ where: { id }, data });
  },

  async delete(id: number): Promise<gastos_proyecto> {
    return prisma.gastos_proyecto.delete({ where: { id } });
  },
};
